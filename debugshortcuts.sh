#this is when xcode tools not selected
sudo xcode-select --switch /Applications/Xcode.app

#pod instructions
pod deintegrate
pod cache clean --all
rm Podfile.lock
pod install

#install cocoapods
export GEM_HOME=$HOME/.gem
export PATH=$GEM_HOME/bin:$PATH
gem install cocoapods --user-install
#need to make sure the path is set correctly and stored in the zshrc file and evaluate it

#for "include of non-modular header inside framework module" in pod file 
target.build_settings(config.name)['CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES'] = 'YES'

#Removing the expo-firebase-analytics is a must, as its recommended


#tu auto submit with expo :
eas build -p ios --auto-submit
#NOTE: remove lock files before submitting !!!!

#api key for appstore 
# App Store Connect API Key:  
#     Key Name  :  [Expo] EAS Submit GUqwV-APUh
#     Key ID    :  D33VVJW74R
#     Key Source:  EAS servers


#clear sim cache 
rm -rf ~/Library/Developer/CoreSimulator/Caches

#clear xcode cache 
rm -rf 


