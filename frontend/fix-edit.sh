#!/data/data/com.termux/files/usr/bin/bash

FILE="pages/my-shop/edit/index.js"

sed -i 's/import { getMyShop, updateShop } from "..\/..\/..\/lib\/shops";/import { useAuth } from "..\/..\/..\/lib\/AuthContext";\
import { getMyShop, updateShop } from "..\/..\/..\/lib\/shops";/' "$FILE"

sed -i 's/const router = useRouter();/const router = useRouter();\
const { user, loading: authLoading } = useAuth();/' "$FILE"

echo "Done."
