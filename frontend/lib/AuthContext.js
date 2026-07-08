import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "./supabaseClient";
import { getFavoriteIds } from "./favorites";

const AuthContext = createContext();

// Maps a Supabase auth user + profiles row into the shape the rest of the
// app already expects (user.name, user.role, user.isBanned, etc.)
const mapProfile = (profileRow) => {
  if (!profileRow) return null;
  return {
    id: profileRow.id,
    name: profileRow.name,
    email: profileRow.email,
    phone: profileRow.phone,
    city: profileRow.city,
    role: profileRow.role,
    isBanned: profileRow.is_banned,
  };
};

const formatAuthError = (error) => ({
  response: { data: { message: error?.message || "Something went wrong. Please try again." } },
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (authUser) => {
    if (!authUser) return null;
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authUser.id)
      .single();
    if (error) {
      console.error("Failed to load profile:", error.message);
      return null;
    }
    return mapProfile(data);
  };

  const refreshFavorites = useCallback(async (userId) => {
    if (!userId) {
      setFavoriteIds([]);
      return;
    }
    try {
      setFavoriteIds(await getFavoriteIds(userId));
    } catch {
      setFavoriteIds([]);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const profile = await fetchProfile(session?.user);
      if (mounted) {
        setUser(profile);
        setLoading(false);
        refreshFavorites(profile?.id);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const profile = await fetchProfile(session?.user);
      if (mounted) {
        setUser(profile);
        refreshFavorites(profile?.id);
      }
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [refreshFavorites]);

  // @param {object} payload - { name, email, phone, password, city }
  const register = async ({ name, email, phone, password, city }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, phone, city: city || "" }, // -> raw_user_meta_data, read by the DB trigger
      },
    });
    if (error) throw formatAuthError(error);

    // If email confirmation is enabled in Supabase (the default), there is no
    // session yet and the user must verify their email before logging in.
    if (!data.session) {
      return { profile: null, needsConfirmation: true };
    }

    const profile = await fetchProfile(data.user);
    setUser(profile);
    return { profile, needsConfirmation: false };
  };

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw formatAuthError(error);

    const profile = await fetchProfile(data.user);
    if (profile?.isBanned) {
      await supabase.auth.signOut();
      throw { response: { data: { message: "Your account has been banned. Contact support." } } };
    }

    setUser(profile);
    return profile;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setFavoriteIds([]);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, favoriteIds, refreshFavorites: () => refreshFavorites(user?.id) }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
