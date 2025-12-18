#!/bin/zsh

echo "🚀 FULL React Native Cleanup & Reinstall Script"

# 1️⃣ Metro server PID varsa kapat
PID=$(lsof -ti :8081)
if [ -n "$PID" ]; then
  echo "🛑 Killing Metro server PID: $PID"
  kill -9 $PID
else
  echo "✅ No Metro server running on port 8081"
fi

# 2️⃣ Node, npm ve nvm cache temizliği
echo "📦 Removing Node, npm, nvm and global packages"
brew uninstall node -f
rm -rf ~/.npm
rm -rf ~/.nvm
rm -rf /usr/local/lib/node_modules
rm -rf ~/node_modules
npm cache clean --force

# 3️⃣ Global React Native / Expo uninstall
echo "📦 Removing global react-native and expo CLI"
npm uninstall -g react-native-cli expo-cli

# 4️⃣ Android Studio ve Gradle cache temizliği
echo "🧹 Cleaning Android Studio caches and Gradle"
rm -rf ~/Library/Preferences/AndroidStudio*
rm -rf ~/Library/Application\ Support/AndroidStudio*
rm -rf ~/Library/Caches/AndroidStudio*
rm -rf ~/Library/Logs/AndroidStudio*
rm -rf ~/.gradle

# 5️⃣ Node ve npm tekrar yükleme via nvm
echo "🔧 Installing Node via nvm"
curl -o- https://raw.githubusercontent.

