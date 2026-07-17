#!/data/data/com.termux/files/usr/bin/bash

FILE="pages/index.js"

START=$(grep -n "{/\* CATEGORIES \*/}" "$FILE" | cut -d: -f1)
END=$(grep -n "{/\* FEATURED CARS \*/}" "$FILE" | cut -d: -f1)

head -n $((START-1)) "$FILE" > work/head.txt
tail -n +$END "$FILE" > work/tail.txt

cat work/head.txt work/categories_new.txt work/tail.txt > "$FILE"

echo "✅ Categories Updated Successfully"
