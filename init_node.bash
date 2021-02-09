
npm init -y
npm install \
    typescript \
    @types/google-apps-script \
    eslint \
    eslint-config-airbnb-typescript \
    eslint-plugin-import@^2.22.0 \
    @typescript-eslint/eslint-plugin@^4.4.1 \
    --save-dev

npm install -g @google/clasp

npm i -S @types/google-apps-script

if [[ ! -f ./tsconfig.json ]]
then 
    tsc --init
fi

# npx eslint . --ext .js,.jsx,.ts,.tsx
