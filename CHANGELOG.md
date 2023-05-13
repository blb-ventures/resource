# Changelog

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
