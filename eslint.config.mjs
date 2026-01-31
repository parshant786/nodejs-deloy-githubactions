export default [
    {
        "files": ["**/*.js"],
        "languageOptions": {
            "ecmaVersion": "latest",
            "sourceType": "commonjs",
            "globals": {
                "process": "readonly",
                "console": "readonly",
                "describe": "readonly",
                "test": "readonly",
                "expect": "readonly",
                "require": "readonly",
                "module": "readonly",
                "__dirname": "readonly",
                "beforeAll": "readonly",
                "afterAll": "readonly"
            }
        },
        "rules": {
            "no-unused-vars": "warn",
            "no-console": "off"
        }
    }
];
