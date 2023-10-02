# Changelog

## [0.11.0](https://github.com/blb-ventures/resource/compare/v0.10.1...v0.11.0) (2023-10-02)


### Features

* adds FieldObjectKind type and dict ([42f0078](https://github.com/blb-ventures/resource/commit/42f00787a8c6322ea2c9bbfdb5a8fb8eb4869395))
* adds instructions, descriptions and usage examples to the README.md ([d1ee988](https://github.com/blb-ventures/resource/commit/d1ee98835e91e38501e828247f3182fb81222c51))
* adds real usage examples ([d1ee988](https://github.com/blb-ventures/resource/commit/d1ee98835e91e38501e828247f3182fb81222c51))
* adds resource field to APIFieldObject ([42f0078](https://github.com/blb-ventures/resource/commit/42f00787a8c6322ea2c9bbfdb5a8fb8eb4869395))


### Code Refactoring

* refactors zod integration function to accept only APIField and not APIFieldUnion ([42f0078](https://github.com/blb-ventures/resource/commit/42f00787a8c6322ea2c9bbfdb5a8fb8eb4869395))


### Build System

* **deps-dev:** bump word-wrap from 1.2.3 to 1.2.4 ([912a42d](https://github.com/blb-ventures/resource/commit/912a42d0ce0b01c6572c82f7d8cded2ef383856c))


### Miscellaneous

* adds a README.md to examples ([2172610](https://github.com/blb-ventures/resource/commit/21726109d7d48ef2dd7246dcca465be1b9216b39))
* adds example screenshot to README.md ([64ca047](https://github.com/blb-ventures/resource/commit/64ca0479f41ba9052ed646caf052867cef4471ad))
* adds examples directory link to the reference in the main README.md ([2172610](https://github.com/blb-ventures/resource/commit/21726109d7d48ef2dd7246dcca465be1b9216b39))
* adds github actions build status for the repo ([2172610](https://github.com/blb-ventures/resource/commit/21726109d7d48ef2dd7246dcca465be1b9216b39))
* adds MIT LICENSE file ([2172610](https://github.com/blb-ventures/resource/commit/21726109d7d48ef2dd7246dcca465be1b9216b39))

## [0.10.1](https://github.com/blb-ventures/resource/compare/v0.10.0...v0.10.1) (2023-06-14)


### Bug Fixes

* adds missing localization to addMultipleValidation ([a8dbb98](https://github.com/blb-ventures/resource/commit/a8dbb98fa8af9cfe1ea9c9c3ccacb81904dfb424))

## [0.10.0](https://github.com/blb-ventures/resource/compare/v0.9.4...v0.10.0) (2023-06-01)


### Features

* improves image and file field validation ([55ed15e](https://github.com/blb-ventures/resource/commit/55ed15ee9212633dbe2aca6c16f887e18c197996))

## [0.9.4](https://github.com/blb-ventures/resource/compare/v0.9.3...v0.9.4) (2023-05-13)


### Bug Fixes

* fixes react-hook-form not rendering the field correctly ([88b5568](https://github.com/blb-ventures/resource/commit/88b55680585b5c64406b7d64ab67095858b9d501))

## [0.9.3](https://github.com/blb-ventures/resource/compare/v0.9.2...v0.9.3) (2023-05-13)


### Bug Fixes

* adds missing validationSchemaBuilder initializer ([2cb1ddd](https://github.com/blb-ventures/resource/commit/2cb1dddba7f2876893b83b9044158058abef958d))
* fixes getValidationSchema override validation object value type ([a248503](https://github.com/blb-ventures/resource/commit/a2485036188e4265fe6285ae7900545589b85679))

## [0.9.2](https://github.com/blb-ventures/resource/compare/v0.9.1...v0.9.2) (2023-05-12)


### Bug Fixes

* makes extra props or validation optional for getFieldListFormField and getValidationSchema ([b4f4b81](https://github.com/blb-ventures/resource/commit/b4f4b8102b8e36df7ee0042166252cdf9e6d1641))

## [0.9.1](https://github.com/blb-ventures/resource/compare/v0.9.0...v0.9.1) (2023-05-12)


### Bug Fixes

* fixes getFieldDisplay value type ([bc6066e](https://github.com/blb-ventures/resource/commit/bc6066e988373e45a70411ee942cc789843e3eaa))

## [0.9.0](https://github.com/blb-ventures/resource/compare/v0.8.1...v0.9.0) (2023-05-12)


### Features

* makes display function returns a generic and makes it more lax by defaulting it to string|null ([31280b3](https://github.com/blb-ventures/resource/commit/31280b3fa845cf0ae7ff251c18819fca8edf0ab0))
* makes react-hook-form adapter return more lax by allowing it to return JSX.Element | null ([31280b3](https://github.com/blb-ventures/resource/commit/31280b3fa845cf0ae7ff251c18819fca8edf0ab0))

## [0.8.1](https://github.com/blb-ventures/resource/compare/v0.8.0...v0.8.1) (2023-05-12)


### Bug Fixes

* removes export of a removed file ([36d41e1](https://github.com/blb-ventures/resource/commit/36d41e14ade4e290a50dc9051213d63adcc2792f))

## [0.8.0](https://github.com/blb-ventures/resource/compare/v0.7.1...v0.8.0) (2023-05-12)


### ⚠ BREAKING CHANGES

* refactors resource manager to depend less on resource types

### Features

* adds playground to package.json scripts ([b78aa8b](https://github.com/blb-ventures/resource/commit/b78aa8b4c22edc391551f87bc9dd9db429266991))


### Build System

* changes github release action ([cc455ca](https://github.com/blb-ventures/resource/commit/cc455cabe7d9238be02a95611046a2be698e6c01))


### Miscellaneous

* removes unused dep semantic-release ([c179259](https://github.com/blb-ventures/resource/commit/c179259baed9c31725072a999ea717e75688e936))


### Code Refactoring

* refactors resource manager to depend less on resource types ([b78aa8b](https://github.com/blb-ventures/resource/commit/b78aa8b4c22edc391551f87bc9dd9db429266991))
