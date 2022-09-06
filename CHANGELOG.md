# OKP4 UI changelog

# [1.14.0](https://github.com/okp4/ui/compare/v1.13.0...v1.14.0) (2022-09-06)


### Bug Fixes

* **stepper:** disable buttons if necessary ([1375537](https://github.com/okp4/ui/commit/1375537bb0528e17a7384bb5365765ec3d1fc63f))


### Features

* add invert prop to icon ([0c25c8e](https://github.com/okp4/ui/commit/0c25c8e0d43b4704e991e5fe965d28f4ae0cae23))
* **theme:** remove secondary invariant color ([04649ce](https://github.com/okp4/ui/commit/04649ceb6ee1d79db6671ecced927739538780d7))
* **typography:** add text decoration property ([0800553](https://github.com/okp4/ui/commit/0800553fa02c1f4f1337ab9cbf2c1c419e594cf7))

# [1.13.0](https://github.com/okp4/ui/compare/v1.12.1...v1.13.0) (2022-08-31)


### Bug Fixes

* add SelectValue & SelectOption exports ([0b5dc7c](https://github.com/okp4/ui/commit/0b5dc7cbcc711fb5bb9a885d901d8129804d7809))
* add UseState type export ([6a47a7b](https://github.com/okp4/ui/commit/6a47a7b005140e8ce062ec21d5b8eb35b2620815))
* **faucet:** check tx code before consider success ([df28999](https://github.com/okp4/ui/commit/df289998b313df150f9a4d4d7abaf355c14267bc))


### Features

* **faucet:** add graphql void scalar ([b1b00f7](https://github.com/okp4/ui/commit/b1b00f71be5e93037b4f47219ff633f9a48f59db))
* **faucet:** add progress bar while requesting funds ([74fe949](https://github.com/okp4/ui/commit/74fe949e33659d460cce6ce2b3abbf3285f9c4a3))
* **faucet:** configure websocket graphql transport layer ([126ad70](https://github.com/okp4/ui/commit/126ad7016ae35ea812bf2ebd90ac1442b1652f08))
* **faucet:** disable buttons while waiting tx ([97ab608](https://github.com/okp4/ui/commit/97ab608f3ad5c033cd5687afc31f69cad6d63318))
* **faucet:** request fund through graphql subscription ([0826e9a](https://github.com/okp4/ui/commit/0826e9ada3cfd81c01e67dd3a1a2a9ac842fe24d))
* **faucet:** update graphql generated types ([302278b](https://github.com/okp4/ui/commit/302278b38c7906dc7208c11cb1196abde96b1fe9))
* **ui:** add loader for faucet ([4d7721e](https://github.com/okp4/ui/commit/4d7721e6cd58e6b2df01f0076a781a489fd8007e))

## [1.12.1](https://github.com/okp4/ui/compare/v1.12.0...v1.12.1) (2022-08-25)


### Bug Fixes

* move lodash from devDependencies to dependencies ([39a1843](https://github.com/okp4/ui/commit/39a1843726e35bead3f58ead3909e4ad597349e4))

# [1.12.0](https://github.com/okp4/ui/compare/v1.11.0...v1.12.0) (2022-08-24)


### Bug Fixes

* add custom polyfill for crypto.getRandomValues ([f260da6](https://github.com/okp4/ui/commit/f260da61ae24596a09cfb57dabf86a2c23eb167d))
* **core:** fix typo in ClearFilections ([6f39d64](https://github.com/okp4/ui/commit/6f39d64a99e04994688439ebe4c98d1c635756b1))
* **core:** replace ThunkResult import path ([38904cc](https://github.com/okp4/ui/commit/38904ccecc3ca61dc2a61456871d2b668680b733))
* fix react keys ([288dc2a](https://github.com/okp4/ui/commit/288dc2a3927ee0ee86cd77be106834322f5038e1))
* use string comparison function ([e48f6b1](https://github.com/okp4/ui/commit/e48f6b1c5dde17e3419bd2d2130cf7db3abc3725))


### Features

* **adapter:** add new FileMapper ([9f8f369](https://github.com/okp4/ui/commit/9f8f369883d393c8fcde1c685c8cfb41fdf5a932))
* add capitalize methods to utils and use it ([7566488](https://github.com/okp4/ui/commit/75664883dbd2a7b3b840f38ecb4bf47ec1142441))
* add document scrollable height for calculations ([4501135](https://github.com/okp4/ui/commit/450113586f58164dd9a5d3742946d786d160acfb))
* add drop down top/bottom repositioning behavior ([b1f933d](https://github.com/okp4/ui/commit/b1f933d9ffe03743afddb8ba1c93ab39fce9a39d))
* add error with helper text ([ad321b1](https://github.com/okp4/ui/commit/ad321b10c52381d85c4dd7d24c4906b3a646005f))
* add getFiles selector with affiliated tests ([bda6230](https://github.com/okp4/ui/commit/bda62306ca46c96de1828b207512d1842e218b02))
* add hook to manage keyboard ([04bb6a6](https://github.com/okp4/ui/commit/04bb6a69fd58e7be06b123c95848c4a3127fe7c9))
* add icon animation ([a841c61](https://github.com/okp4/ui/commit/a841c6131b16a566384488c0b05092e836648713))
* add icons properties to the list component ([3e7f69a](https://github.com/okp4/ui/commit/3e7f69a1f3faaae46d6680281238b1a8fb54318a))
* add id property to FileDescriptor ([2ad1b84](https://github.com/okp4/ui/commit/2ad1b84df158d168dbb2a81eca8e8a18cbad27ff))
* add list and list item components ([99c0c15](https://github.com/okp4/ui/commit/99c0c15facf13ec2ea523468b3fd1ede72981149))
* add missing jest environment jsdom ([4e71d8b](https://github.com/okp4/ui/commit/4e71d8b4571fd5a157504d2d2bc73d8649a649f7))
* add multiline to text field ([4b5a162](https://github.com/okp4/ui/commit/4b5a1622a6bbd6c2ec0fb2ae887bfbc08ef1cb42))
* add multiple property & affiliated story ([93b8b5a](https://github.com/okp4/ui/commit/93b8b5a64edff0b6cd4fc4f7ec8c50702b0fb6e3))
* add okp4 icon ([6282c30](https://github.com/okp4/ui/commit/6282c306dd46b56f7da883db830a825d7ffbb7aa))
* add readOnly to inputBase to improve selection ([bacb7f3](https://github.com/okp4/ui/commit/bacb7f374b1e70b43e469b42c778743f0e6ca162))
* add right icon to input base ([1e4a2d4](https://github.com/okp4/ui/commit/1e4a2d479226af0136db94930c1ea6ddd584f526))
* add select component ([a1dbe0b](https://github.com/okp4/ui/commit/a1dbe0b9ba7f0e865d28ecbbfc8f5fdc4988cd50))
* add sortGroupsAndOptions property ([d7dca93](https://github.com/okp4/ui/commit/d7dca9376fecd30846d0679ad78f081a460e0eac))
* add sorting methods to utils ([e5fe42d](https://github.com/okp4/ui/commit/e5fe42d90eeec8491f9661e028f8761c66af9029))
* add useOnClickOutside hook ([9c73505](https://github.com/okp4/ui/commit/9c73505bd25269abad0ec5775ae5ba36f6f22520))
* add UseState type to Select ([abe1f05](https://github.com/okp4/ui/commit/abe1f05b0ea6e2c944f75e98aeac9c89beda6826))
* add util compare strings method ([8760e5f](https://github.com/okp4/ui/commit/8760e5f1eee61a66a3b6a71f2ed66d12055f1738))
* **builder:** add FileStore builder ([b5642ea](https://github.com/okp4/ui/commit/b5642ea8b00d412ddec0baa52052beda8a467268))
* **builder:** add new FileBuilder ([32970e2](https://github.com/okp4/ui/commit/32970e2850de6be89ea3208e906a692febf7ea6c))
* **context:** add FileContext and export it ([076bb9c](https://github.com/okp4/ui/commit/076bb9c5e5929ed9b3d536c0944b27f065a1c79d))
* **core:** add builder and mapper in saveFiles usecase ([8ccf30f](https://github.com/okp4/ui/commit/8ccf30fdde8834af161c9903e8541beb2b12542c))
* **core:** add clearFile usecase and actions ([41eb085](https://github.com/okp4/ui/commit/41eb085ced7255303963e034b7baf318bc6f34d2))
* **core:** add clearFiles usecase and actions ([eac972d](https://github.com/okp4/ui/commit/eac972df9966ddbd5efb35072b32f36d6adbfd90))
* **core:** add error entity ([6b36895](https://github.com/okp4/ui/commit/6b3689518c308dceeefb80ef41ff3147978e24b9))
* **core:** add file entitty ([15575b3](https://github.com/okp4/ui/commit/15575b315fec1195fdaeee69e1a22861d6b833cc))
* **core:** add saveFile command ([90fda24](https://github.com/okp4/ui/commit/90fda241024506cd8c578dc959c7efc7c2f03f65))
* **core:** export file usecases ([2710e2f](https://github.com/okp4/ui/commit/2710e2f7d6eb3fc08050f22941d0d438ed4a985d))
* **core:** init saveFiles usecase ([403f0fa](https://github.com/okp4/ui/commit/403f0fa388423ea4cc3aaa9f15ca27d0e91155da))
* **hook:** add FileHook and export it ([13adae5](https://github.com/okp4/ui/commit/13adae536908968b093c51056514fd2ad76a21cc))
* improve disabled and overflow to inputBase ([6c4ef3a](https://github.com/okp4/ui/commit/6c4ef3a60b2b6161730a974e48ed7c25db683736))
* improve disabled and readOnly in select ([f94fa88](https://github.com/okp4/ui/commit/f94fa88ea34532964fd3862425e9c029a08dc647))
* improve JSX element global writing ([460f2e2](https://github.com/okp4/ui/commit/460f2e21c88d1ed16e50412646fc1e2ad7f93710))
* improve options list position ([391503d](https://github.com/okp4/ui/commit/391503d62d0705de3eceed2e89f8cfeba38c822c))
* improve select options global display ([e11655a](https://github.com/okp4/ui/commit/e11655ab995c5f2a60f5991e96da3e023392056f))
* improve usage of label and value ([56790ca](https://github.com/okp4/ui/commit/56790ca66d64479b2a944a55dd761f81d69f61b2))
* make title not mandatory ([5ad3306](https://github.com/okp4/ui/commit/5ad330682d2bb884dd4366a90d951c04b69c46f3))
* **redux:** init file store and reducer ([9c3a89a](https://github.com/okp4/ui/commit/9c3a89ac936822bd309a83c8b66c18473dd8bec5))
* **redux:** update reducer with new actions ([b23f4a9](https://github.com/okp4/ui/commit/b23f4a9cebfdbe6a87cd8b4f62fa602859e76515))
* refined the component properties ([3be61a3](https://github.com/okp4/ui/commit/3be61a36121effa58c760372c2b1211b5934db81))
* remove duplicated sort method & add args to compareStrings ([6f1ddc2](https://github.com/okp4/ui/commit/6f1ddc25bb890a38d13f78a97d6af826b2ccf65c))
* remove left & right elements props from List ([2815f4d](https://github.com/okp4/ui/commit/2815f4d35e6c56eee6619c503fba9139d78c5561))
* remove useless onIconClick ([510e960](https://github.com/okp4/ui/commit/510e96046e78fd9d4e588c43706dae971ef5f341))
* rename property name ([c784ff5](https://github.com/okp4/ui/commit/c784ff5e4e79d9712e5b0fe925a667afffd7a5f7))
* update text field callback dependencies ([065119a](https://github.com/okp4/ui/commit/065119abf9d9eb056e4165e4667fa8e552350f79))
* use ListItem as a children node of List ([b975f84](https://github.com/okp4/ui/commit/b975f844718ffcb48dab068cd06f56f98db69b03))

# [1.11.0](https://github.com/okp4/ui/compare/v1.10.0...v1.11.0) (2022-08-17)


### Bug Fixes

* **ui:** import svgxuse as polyfill ([4eeaac4](https://github.com/okp4/ui/commit/4eeaac44b59777497ec8b9f17dfdb1b047cbfbed))


### Features

* add calendar icon ([99160f3](https://github.com/okp4/ui/commit/99160f310ae3d1f2fa5c6c33b26d3e7e069d8b6c))
* add property to toast & remove redundant classes ([ad952d3](https://github.com/okp4/ui/commit/ad952d36f8ddaea50e6a2b47c7ff8f7089925518))
* add style to property & clean up stylesheet ([ffc0fc7](https://github.com/okp4/ui/commit/ffc0fc7fd7e1daf15cb4af23942e11b8d78d7abd))

# [1.10.0](https://github.com/okp4/ui/compare/v1.9.0...v1.10.0) (2022-08-05)


### Bug Fixes

* **i18n:** correct typo ([c2912bb](https://github.com/okp4/ui/commit/c2912bbfba8a6939711c91ec05dc681e39b61ee8))


### Features

* add babylonjs engine atom ([3d3740e](https://github.com/okp4/ui/commit/3d3740e4a0a3430d3d52a18aa8801f68e16e2f4e))
* add check, clock and cross  icons ([be19927](https://github.com/okp4/ui/commit/be199278142698672d90fec9c9dca7e2f444cb6f))
* add close icon ([6752c35](https://github.com/okp4/ui/commit/6752c35b75483ab3114828d03f39eb1a0175ea62))
* add i18n label for buttons ([bf20df5](https://github.com/okp4/ui/commit/bf20df59099d8b25467269b513d589f3f4dcbde3))
* add icon component ([0e01dcd](https://github.com/okp4/ui/commit/0e01dcde186c8f838bba1456f02fcbbf656b9bc3))
* add icons, change name & uniform colours ([0a7b968](https://github.com/okp4/ui/commit/0a7b968506f21292b0c059c14b62fbb6c8202ff8))
* add jsx element type to description ([e7a39b1](https://github.com/okp4/ui/commit/e7a39b1095a3108529b9fef3de433eb333acf012))
* add max-width to logo & adjust logo documentation ([70673dd](https://github.com/okp4/ui/commit/70673ddd27e5480387e004c1e90ff483405ff8ef))
* add new icons to type ([d3e27ee](https://github.com/okp4/ui/commit/d3e27ee6f9581ab4e77af6ec9db1fa6be31d141c))
* add new logo to storybook ([6cad3e1](https://github.com/okp4/ui/commit/6cad3e18133b9cd5abb7aca05af249b20b0d4e60))
* add okp4 icons ([2833dab](https://github.com/okp4/ui/commit/2833dabfb0fb3c80b8ab0168f74a5bacea3d9853))
* add properties to button ([454a0da](https://github.com/okp4/ui/commit/454a0da0dc389a541be4efa6f33ab214b6caa330))
* add reset button in the last step and refactor code ([4cb1d1e](https://github.com/okp4/ui/commit/4cb1d1e485b93e0dfcfebe2ae0e1e85e25e6976e))
* add responsive design ([4fcb7a8](https://github.com/okp4/ui/commit/4fcb7a8c0436112dc34c496bb6724fc2f7d0fa3d))
* add responsive style ([e003f89](https://github.com/okp4/ui/commit/e003f89455060234603fa1e4557df8633db462a5))
* add sprites scripts ([5e2fa18](https://github.com/okp4/ui/commit/5e2fa18d21559ba9977794f432b3e4e3b61f251d))
* add state to watch useful steps changes ([3b3748f](https://github.com/okp4/ui/commit/3b3748f8e683e9cffd6b4df91539bd645be449a4))
* add stepper export ([ad3fd78](https://github.com/okp4/ui/commit/ad3fd78a07a2c4893e58bd9e615dfe2f6ac5bd31))
* add string type guard function ([0f25e5e](https://github.com/okp4/ui/commit/0f25e5e9b11b296c26ac312bcb596062b095af41))
* add success content after submit ([72e6685](https://github.com/okp4/ui/commit/72e6685f43938575d21cc9783df8f6a964b1f187))
* change step status management ([2d62b75](https://github.com/okp4/ui/commit/2d62b75dcbe9331b90a0036c22716c8323b8dfeb))
* create stepper component ([24433e2](https://github.com/okp4/ui/commit/24433e26f2cfab18e03df630f7de738d1e05618f))
* declare type for managing a state ([22be8b3](https://github.com/okp4/ui/commit/22be8b3963ebdf1068be04a808d30b682e998121))
* declare type to manage callbacks ([78939d4](https://github.com/okp4/ui/commit/78939d4088d910a4f7c06f619d5dffd2e675845e))
* fix reset state ([c3a99af](https://github.com/okp4/ui/commit/c3a99aff0ff2c9bfc62de3192327e2f2ee67821f))
* improve step styles ([80c8f2d](https://github.com/okp4/ui/commit/80c8f2da8a560740bfffd79328c3de55ae0c827e))
* improve stepper styles ([615a486](https://github.com/okp4/ui/commit/615a4862d4e0bc609f69bab6157cdf13d0be0050))
* introduce useReducer to manage local state ([179770a](https://github.com/okp4/ui/commit/179770ad369d51a4baab40d72df7e040c6f97962))
* remove step component and refactor status management ([afd1419](https://github.com/okp4/ui/commit/afd1419ed43d9dcc46582d3a30a8eb185a77eb88))
* replace next and previous text by icon ([6e506ed](https://github.com/okp4/ui/commit/6e506edb99715ac58cc2c6916f4cf80143b13b9d))

# [1.9.0](https://github.com/okp4/ui/compare/v1.8.0...v1.9.0) (2022-07-19)


### Bug Fixes

* readonly issue in file input component ([576a66e](https://github.com/okp4/ui/commit/576a66e6f8fb88aa9d06e16cd5332f6a548eae6f))
* responsive issues ([02545c8](https://github.com/okp4/ui/commit/02545c89e11c2a9494b43fd1bcf72321df50e25e))


### Features

* create file input component ([60ded66](https://github.com/okp4/ui/commit/60ded669892224dc0a25c6c012859672607a9591))
* create progress bar component ([6db90c4](https://github.com/okp4/ui/commit/6db90c4900d9e87cc07ecc9d86cb7008fe47f6d4))
* **hook:** add hook to manage element resising ([bfd739d](https://github.com/okp4/ui/commit/bfd739dc488a232f1840065eeb97ef84ee7ab282))
* manage the error state of the file input component ([9c1bf72](https://github.com/okp4/ui/commit/9c1bf729307eb3ba22a0a3ef162a1491cc4730c0))
* remove any type for icon ([efe3bf1](https://github.com/okp4/ui/commit/efe3bf15a4d9fb6da640a743a0df4d0ea12bc7f0))

# [1.8.0](https://github.com/okp4/ui/compare/v1.7.0...v1.8.0) (2022-07-11)


### Bug Fixes

* adjust header & footer padding ([f7bcb0e](https://github.com/okp4/ui/commit/f7bcb0eceffb02fccded1ec65187e2b109e72cb0))
* change useffect if statement ([3d0cc22](https://github.com/okp4/ui/commit/3d0cc22dc2a1fa9fe4a6201345fe603db7340fd4))
* move all necessary packages to dependencies ([d9462fa](https://github.com/okp4/ui/commit/d9462faa859a615c2726a96d41b065f0814b770e))
* remove default theme parameter from local storage ([3af7941](https://github.com/okp4/ui/commit/3af7941922cbb6b20ecc5e65ff5106cf1f21e31f))
* remove svg files from rollup-plugin-image scope ([32eee8c](https://github.com/okp4/ui/commit/32eee8ce8f803e61ec596403bf3b832b2d04e37b))


### Features

* add inputBase atom component ([b6980b7](https://github.com/okp4/ui/commit/b6980b7191d7a29f5d6564a2e550163d946a81ca))
* **assets:** add keplr image ([f837755](https://github.com/okp4/ui/commit/f837755266c48d371b464a37b9666dcbab22db48))
* change logo images ([30f57d2](https://github.com/okp4/ui/commit/30f57d2a0a3b1f5a60b2942a05985ebe0f876106))
* **domain:** load error translations at default domain export ([3acb7c2](https://github.com/okp4/ui/commit/3acb7c28640e782dce32e213fb1e185c9648eb43))
* embed inputBase in textField ([026248e](https://github.com/okp4/ui/commit/026248ec52e209e5598597556f0625d9c0392643))
* export all necessary files to be bundled ([a4a0971](https://github.com/okp4/ui/commit/a4a097168105f2fe103ac233d1850a8c78271b39))
* **i18n:** add translations for faucet ([88a467f](https://github.com/okp4/ui/commit/88a467f2a3815b63772c31ef1e49f83edcbb3732))
* **i18n:** update faucet translations ([faf097a](https://github.com/okp4/ui/commit/faf097af3bb1397327c30e73799aa402f8292215))
* improve TextField & InputBase types ([805060d](https://github.com/okp4/ui/commit/805060d68da9d53a732858522e5a9e622fac70b1))
* **redux:** add task selectors ([49c5d1b](https://github.com/okp4/ui/commit/49c5d1b878834c2e724aeb6f39eca6d161d079e9))
* remove redundant readonly ([b0715cb](https://github.com/okp4/ui/commit/b0715cbd3391bfa9315e59ee3dc51e262d02f3a9))
* render component generic ([ee7eaa3](https://github.com/okp4/ui/commit/ee7eaa30e55a706da2cc8d437046dec028c7d5a9))
* **ui:** add Faucet component and export it ([bd49500](https://github.com/okp4/ui/commit/bd495007b331b306c7eec50eab28c9296d51a995))
* **ui:** add task management in faucet ([51f7da8](https://github.com/okp4/ui/commit/51f7da813c2918e37e12b1c67ba48db9aea4dd03))

# [1.7.0](https://github.com/okp4/ui/compare/v1.6.0...v1.7.0) (2022-06-21)


### Bug Fixes

* **adapter:** wrong path for eventBus instance ([be0eeb9](https://github.com/okp4/ui/commit/be0eeb9df8c7dc3e9c27b02ed410fa405d1f3271))
* add images copy into rollup config ([ad57c1b](https://github.com/okp4/ui/commit/ad57c1b41c2c20c1b6a5556c081a6e3f893e7c99))
* add urls stylesheet to rollup config ([7eb7ae7](https://github.com/okp4/ui/commit/7eb7ae71214937210306f8fb5cafdfce9591a79f))
* card responsiveness ([0515ed5](https://github.com/okp4/ui/commit/0515ed576bb74d68c0c793cd0c5c447ca6afe274))
* ignore type checking for elements in main storybook config file ([9d65d69](https://github.com/okp4/ui/commit/9d65d691415f1f101f870d37f5d030cae5ab0d3f))
* remove background images & affiliated urls ([8433f61](https://github.com/okp4/ui/commit/8433f6111ac095abbb9e08e5ac5a3c3ca48a4072))
* remove images from destination path ([3182ff7](https://github.com/okp4/ui/commit/3182ff7203066df243da0a82f8cbbbe20d16a1f4))
* remove undefined types ([8ccc350](https://github.com/okp4/ui/commit/8ccc3502ca20b56557055576cd1db5b5b1768045))


### Features

* **adapter:** create urql client for faucet gateway ([bb72676](https://github.com/okp4/ui/commit/bb726761757123b7e3dfa444bb011071dd9c77e3))
* **adapter:** switch from rest implementation to graphql in HTTPFaucetGateway ([7d5e702](https://github.com/okp4/ui/commit/7d5e7025b99493ab6e07e8bb544a7827574f6e0e))
* add cosmos images to assets ([d9db584](https://github.com/okp4/ui/commit/d9db5844e27b3102512ac562674d1ef52b54b9ee))
* add footer component with stylesheet & en/fr translation ([99e7b03](https://github.com/okp4/ui/commit/99e7b033e82cb2942bab5e6333c81a5cd3472efe))
* add internationalization to story ([704e957](https://github.com/okp4/ui/commit/704e95756889ac6b087fa90eaae26aacc25219c3))
* add language functions to utils ([e678e1b](https://github.com/okp4/ui/commit/e678e1ba6498154c52c03ece78681c9c9a72b826))
* add language method to utils ([c7559f8](https://github.com/okp4/ui/commit/c7559f807690a7999889c099e834144147a7ab42))
* add language regex check ([da095e2](https://github.com/okp4/ui/commit/da095e2d862aa401e46d3b2ed3572e59f6f5ad2a))
* add language switcher ([24c583e](https://github.com/okp4/ui/commit/24c583eaf84c601c2707a7365c23da490cd69f90))
* add language switcher story ([e449a2f](https://github.com/okp4/ui/commit/e449a2f3a427ed5c3747f8a44a41cf1eb183c649))
* add languages props to switcher ([a54cf0f](https://github.com/okp4/ui/commit/a54cf0f8b6b4c109cc5c71d5ea6d6b89231c10bb))
* add new cosmos variables ([7d7ab2a](https://github.com/okp4/ui/commit/7d7ab2af9e6c728f1b34adf512fc737798b7a297))
* add okp4 to classnames ([08840dd](https://github.com/okp4/ui/commit/08840dde1b8555ddd8be03df3b2ce3471e4525eb))
* add UseTranslationResponse export type ([ec22f71](https://github.com/okp4/ui/commit/ec22f710ff7d576fd479d64b58a08f68fa82afde))
* **builder:** add new ErrorStoreBuilder ([b061f86](https://github.com/okp4/ui/commit/b061f86075e8d7d35505677bb6ad57f5f6028796))
* **builder:** add new FaucetStoreBuilder ([a35385a](https://github.com/okp4/ui/commit/a35385a635729a9b56e209f06a59b9ee9071af81))
* **builder:** add new TaskStoreBuilder ([df1201f](https://github.com/okp4/ui/commit/df1201f931a19c480a9e2a444c7b3b31c4c8cf68))
* **builder:** add new WalletStoreBuilder ([79d9bf3](https://github.com/okp4/ui/commit/79d9bf395fc78d561ac035a4b7d94ac53f304b35))
* change display property to flex & add min-height ([e0bba1e](https://github.com/okp4/ui/commit/e0bba1e558737c11bc3a2247905453a29e19f9cc))
* change flex display by grid ([b80425a](https://github.com/okp4/ui/commit/b80425a8cf2305ba42e3f5337de62fa305d6abe9))
* complete story ([41436d2](https://github.com/okp4/ui/commit/41436d2da5f5b69143e0f22725d42391408f1429))
* **context:** create store contexts and export them ([626b93d](https://github.com/okp4/ui/commit/626b93d1a0def53dfa1bf74ff970df5c64b7477a))
* enforce language types ([efb079b](https://github.com/okp4/ui/commit/efb079b874cf68f58e5550c4fafc2d9557b33d16))
* enforce typography usage ([479b3b7](https://github.com/okp4/ui/commit/479b3b754a93a95e863185270cb602572f709b0b))
* generalise brand link & rename css class ([ae85cce](https://github.com/okp4/ui/commit/ae85cce4fc25dda10a554bd53a8ea7d07954c5f2))
* generalise component ([f957265](https://github.com/okp4/ui/commit/f9572655a745cab94fb8d89e92f98548f245d832))
* **hook:** create store hooks and export them ([a436da3](https://github.com/okp4/ui/commit/a436da3ad237d08120dbcc95fb8a7f6c572758bb))
* improve internationalization story ([59825c2](https://github.com/okp4/ui/commit/59825c205a6cd2ad8f71cb2caedfde625b9b65f5))
* improve language type ([c5971cd](https://github.com/okp4/ui/commit/c5971cdcb104aae05cc87364621fd292837f5258))
* improve map usage ([ae05c3c](https://github.com/okp4/ui/commit/ae05c3c7ce801ac8a8366b03c1a032828f6429c4))
* improve switcher tsx ([53670c8](https://github.com/okp4/ui/commit/53670c8db769402329a62524f82ae8b53dcf185b))
* make switcher change language ([5fad121](https://github.com/okp4/ui/commit/5fad121d312a3c606e3d10c4e87e670acbd6f29b))
* **redux:** add preloadedState parameter for faucet store ([3eb7592](https://github.com/okp4/ui/commit/3eb7592f86f9096af74172da056dee202a90fa86))
* **redux:** add preloadedState parameter for wallet store ([ac4d229](https://github.com/okp4/ui/commit/ac4d2298e149eb79eb32a609d384f40308e26d30))
* refine language property ([1323cd9](https://github.com/okp4/ui/commit/1323cd994c93a94126af12aa54933fc3a7dc135f))
* remove i18n instance export ([fa0f185](https://github.com/okp4/ui/commit/fa0f1852ec820a319623b014051bcaa5c8720d1f))
* remove query string from i18n ([d767520](https://github.com/okp4/ui/commit/d76752063646a2af34717c4be94303a15e2724df))
* **ui:** add a store provider to handle multiple context injection ([e680e9e](https://github.com/okp4/ui/commit/e680e9e0f2174376f69a71af8bbbafc6ab00bc67))
* update internationalization story ([4555ac0](https://github.com/okp4/ui/commit/4555ac0f5b952aa5de9373a84b9859ba8cb88520))

# [1.6.0](https://github.com/okp4/ui/compare/v1.5.0...v1.6.0) (2022-05-30)


### Bug Fixes

* **button-story:** add buttons wrapping ([382d35f](https://github.com/okp4/ui/commit/382d35f79b5a9cd46637805707d8ae8a824df842))
* **button:** make button text wrap if needed ([24e6f53](https://github.com/okp4/ui/commit/24e6f532e6931d03560f1d8f415763932c15cee7))
* **hook:** add missing dependencies to useMediaType effect ([24ae865](https://github.com/okp4/ui/commit/24ae8656953aec2824fae70dc97ecaf9ec13e433))
* improve word breaking ([1d217de](https://github.com/okp4/ui/commit/1d217de2ab1de3ae3cc53bbca1ac996bcab29c84))
* increase padding size due to polygon ([145b863](https://github.com/okp4/ui/commit/145b8634a52220b31c495b936eea18de50d1ae88))
* remove useless width ([9bcfb41](https://github.com/okp4/ui/commit/9bcfb410d85330786b3412818eb6c27e354202d2))
* **size:** add maxWidth to avoid text overflow ([46ad991](https://github.com/okp4/ui/commit/46ad99147a1f5348d25383436cf1f796f89ada3c))
* **storybook:** add comment to explain css hack ([0ab5ece](https://github.com/okp4/ui/commit/0ab5ece11bde83e2d16e3856365e32af29b5ccf6))
* **storybook:** enable features.modernInlineRender in main configuration ([1047e4b](https://github.com/okp4/ui/commit/1047e4b2863da8fd72db65b5d80472c340e05fac))
* **storybook:** force height to auto mode for a targetted div ([512e9ee](https://github.com/okp4/ui/commit/512e9ee5cc9f648298e77c9f269a57031e5e9dec))
* **story:** remove deprecated @storybook/addon-docs/blocks import ([cc8c37f](https://github.com/okp4/ui/commit/cc8c37f18214d3f4ed8bcdecf892e3d7588f6bdf))


### Features

* **adapter:** add task primary eventListeners ([371c2da](https://github.com/okp4/ui/commit/371c2da7b92d453fbf71d72abaa6f384bd2e967e))
* **adapter:** integrate metadata in primary listeners event types ([2afb0a2](https://github.com/okp4/ui/commit/2afb0a28dddefdbed7245bde5233587a70f0d816))
* add breakpoint & adjust padding ([1af7ac1](https://github.com/okp4/ui/commit/1af7ac1056ed0da7c4f8e1bcfa2487c357e864a8))
* add event listener to media type handler ([a491efd](https://github.com/okp4/ui/commit/a491efdb132e690f01a6a094e34ed855f6f74bb5))
* add header ui component with style ([f61408e](https://github.com/okp4/ui/commit/f61408ea25e3b2eb6053acbb4f1b472cf1cb7532))
* add screen size handler ([55db0e0](https://github.com/okp4/ui/commit/55db0e04689f1bd1f1c689645b0f57f44223c7a2))
* **builder:** add new TaskBuilder ([a2f2f75](https://github.com/okp4/ui/commit/a2f2f75e7f22b19bbaa19f45e525877988b22d11))
* **builder:** add new UpdateTaskBuilder ([82a5a5f](https://github.com/okp4/ui/commit/82a5a5f5d171d46aa7cb8779074b5e3a304b55eb))
* **builder:** add withInitiator method in error.builder and invariants ([bf802cf](https://github.com/okp4/ui/commit/bf802cf99b7a00964ee6d4e1656a4a48f7ad8ad0))
* **buttons:** swap width change by padding ([5ff3fac](https://github.com/okp4/ui/commit/5ff3fac3299b5d437e42eb5a21894e12503bde81))
* **core:** add acknowledgeTask usecase and actions ([9ea9834](https://github.com/okp4/ui/commit/9ea9834e3a3725130c0c79a843ad4d7c5b70a95d))
* **core:** add clearTask usecase and actions ([ffb4825](https://github.com/okp4/ui/commit/ffb4825a77e3c86581614580f5a3dcc0ea859b8d))
* **core:** add clearTasks usecase and actions ([06356c8](https://github.com/okp4/ui/commit/06356c8c3df46299fe2c81c9e30c5d28dc875e69))
* **core:** add common event types for task actions ([158cdc3](https://github.com/okp4/ui/commit/158cdc3497d41890c2cb81b19a94f455eca8ede3))
* **core:** add error entity ([ab0f6f0](https://github.com/okp4/ui/commit/ab0f6f040aa0b4bc1298bff5862ec9ffac1f71a6))
* **core:** add initiator property to error entity ([cae83c8](https://github.com/okp4/ui/commit/cae83c8924232cd7a3b072a7c141474a2243fce5))
* **core:** add registertask use case ([c89f05f](https://github.com/okp4/ui/commit/c89f05fea5060d7337cab5036a8796c937c2467c))
* **core:** add task entity ([dcb0978](https://github.com/okp4/ui/commit/dcb0978c70d1dd9bdfc9ce384b129c228958ae86))
* **core:** add task management in requestFunds usecase ([cb62a95](https://github.com/okp4/ui/commit/cb62a95ba637839b50448554363c4ea225550a0e))
* **core:** add updateTask usecase and actions ([9906a56](https://github.com/okp4/ui/commit/9906a5680a76bd032e28a511ea8a9d2496add803))
* **core:** create actions for registerTask use case ([c0bcdcf](https://github.com/okp4/ui/commit/c0bcdcfb6c506ec97c0a7bab0ac174e3f567c605))
* **core:** dispatch new task events in requestFunds use-case ([368d2dd](https://github.com/okp4/ui/commit/368d2dd49255c51a9a5591669d02fa4ae08f9c9e))
* **core:** type published events with TypedBusEvent ([520aa38](https://github.com/okp4/ui/commit/520aa389d2c39753dcdd748fedf1d6498185e2aa))
* **evenBus:** add EventMetadata & TypedBusEvent types ([8836b78](https://github.com/okp4/ui/commit/8836b78ce8b344972294f1459240dfdad3d85cbb))
* **redux:** add appState, store & reducers ([0908e13](https://github.com/okp4/ui/commit/0908e134ca3df1faa5410b70a41523bd0c11bd94))
* **redux:** add initiator parameter to eventBusMiddleware method ([cbc94fc](https://github.com/okp4/ui/commit/cbc94fc107521698db92a00f243a8c9ecadf6982))
* **redux:** add metadata property into eventBus middleware  publish method ([bd73949](https://github.com/okp4/ui/commit/bd73949fe9c04ba31d3c081ccc78a8748f6c835a))
* **redux:** add reducer for task/taskAcknowledged action ([f269fdc](https://github.com/okp4/ui/commit/f269fdc2a0697e4dac1bb666638ccf9de54ff6d6))
* **redux:** add reducer for task/tasksCleared action ([03143da](https://github.com/okp4/ui/commit/03143da1beeaf129e6e2e91f1056110ae896d0ad))
* **redux:** add reducer for task/taskUpdated action ([8691d44](https://github.com/okp4/ui/commit/8691d44801653382de7320e6ea546fa0c2786c5e))
* **redux:** add task appState ([167662a](https://github.com/okp4/ui/commit/167662ac01f387ea279514071db72361cce954a8))
* **redux:** modify appState & handle task/taskCleared in reducer ([4d8eb53](https://github.com/okp4/ui/commit/4d8eb535147c08a98abf3404dd2e2f7f4b5ad4ef))
* **redux:** remove isProcessing from state, reducer & actions ([9ecf583](https://github.com/okp4/ui/commit/9ecf5837a01e0b9cbb56d788aab69c9bece5fe95))
* **textField:** add fullWidth property ([2d8749f](https://github.com/okp4/ui/commit/2d8749fe94b627f807a231af8c017b3e44f4f7e7))
* **types:** move common types in domain/common & superTypes folders ([3e3afc7](https://github.com/okp4/ui/commit/3e3afc7e4b62632fe2ba21be0b783ba6cb5545c9))
* **ui:** export Header component ([c5e6231](https://github.com/okp4/ui/commit/c5e623179d45945e14507f4eaed2037b2139c4d7))

# [1.5.0](https://github.com/okp4/ui/compare/v1.4.1...v1.5.0) (2022-05-04)


### Features

* **i18n:** add FR and EN main translations ([03ac0c0](https://github.com/okp4/ui/commit/03ac0c00d891a1a01c8965535545414d6790f276))
* **i18n:** add useTranslation hook to ensure i18n is correctly bind ([53e460b](https://github.com/okp4/ui/commit/53e460bbc3bd56ca84692c575107d72daa6a438e))
* **i18n:** init i18next instance and add dedicated configuration ([0699d94](https://github.com/okp4/ui/commit/0699d9493de58818e6437e2e9ba7e44ef487165a))
* **i18n:** move resource upload from init to dedicated utils methods ([58a0967](https://github.com/okp4/ui/commit/58a09675bebea18a7e098c3cc1c2acebad9a020f))
* **main:** export all i18n elements to library ([82ba728](https://github.com/okp4/ui/commit/82ba728639b2555d4aa0bef9b9274ca7d7a1bc67))
* **project:** add new JSONValue type for JSON elements ([dcbcad4](https://github.com/okp4/ui/commit/dcbcad409fa6abe1a2e5a326e6732732bf16da89))

## [1.4.1](https://github.com/okp4/ui/compare/v1.4.0...v1.4.1) (2022-05-02)


### Bug Fixes

* **project:** export Toast component to library ([5ecfc9e](https://github.com/okp4/ui/commit/5ecfc9ee5dbce38beda7ad650e1288b241af9e55))

# [1.4.0](https://github.com/okp4/ui/compare/v1.3.0...v1.4.0) (2022-05-02)


### Features

* **component:** add comments to props to build documentation ([1f42280](https://github.com/okp4/ui/commit/1f42280e7c34f82b6bcf429103dd40a3d81daab3))
* **component:** add severityLevel prop & enhance component ([50632c3](https://github.com/okp4/ui/commit/50632c31d3ad685441e764d538c42d1f262a4b2d))
* implement new toast component ([5f00e77](https://github.com/okp4/ui/commit/5f00e771262be866d1a93e9d6eb396233dadf71e))

# [1.3.0](https://github.com/okp4/ui/compare/v1.2.0...v1.3.0) (2022-04-29)


### Bug Fixes

* invert gradient-dark-background-footer-block colours ([35ae041](https://github.com/okp4/ui/commit/35ae041fbbe67d785dfb598376655a21b4e6e662))
* remove other props notion from component ([c51e49e](https://github.com/okp4/ui/commit/c51e49ebe4d87a36bbbd925f80c773592c9622c4))


### Features

* **adapter:** add eventListener primary adapter ([bfcf505](https://github.com/okp4/ui/commit/bfcf505af2cef8dce8b8dedcda66d0a1d7ec6761))
* add background class ([e7d0089](https://github.com/okp4/ui/commit/e7d0089312bfb90b9c19a6f0905cedeaf028835b))
* add border to card ([394214c](https://github.com/okp4/ui/commit/394214cfa607aa83d2287cbafc6ca5499f6c842a))
* add card beveled with background properties ([c6022ab](https://github.com/okp4/ui/commit/c6022abbb43ee90fd84dc5d9967171d398216d98))
* add card color ([0ea8ecc](https://github.com/okp4/ui/commit/0ea8ecc0b4e6836597d5213d98e5b645d672b414))
* add content max height ([7ed4eb2](https://github.com/okp4/ui/commit/7ed4eb2c2d2db531da19da0114550dc9bd72dad0))
* add left and right padding ([67cdfcd](https://github.com/okp4/ui/commit/67cdfcd9fa3d8d88ab1b19eaf7b9f6d996d9df50))
* add theme border color ([11a1b53](https://github.com/okp4/ui/commit/11a1b5311c1710a1ea5e147e9fb93011bf825241))
* **core:** add error domain entity ([7dd3fd2](https://github.com/okp4/ui/commit/7dd3fd2456f639bee396b6451480cd364bd845ae))
* **core:** add error domain usecases ([dcd4dfa](https://github.com/okp4/ui/commit/dcd4dfad5889a884ec01fb06c683cd19956e84a6))
* **core:** add new type folder with entity declaration type ([22fd8e5](https://github.com/okp4/ui/commit/22fd8e5cde80520cfdd6dcd33a63607ff7ad0d4d))
* **core:** add ThrowErrorActions to common folder ([29907a6](https://github.com/okp4/ui/commit/29907a641ef38d51e5300e0865cee73e9f1d0bb5))
* **core:** implement error.builder ([748b573](https://github.com/okp4/ui/commit/748b5733f95a847ed7b97256de6d07cad465e86f))
* **core:** implement error.mapper ([64c4b5d](https://github.com/okp4/ui/commit/64c4b5d7f551664575214358a6b598289abd0f19))
* **core:** remove own error management into faucet domain ([2cc4d7c](https://github.com/okp4/ui/commit/2cc4d7c3ad6e01c3a718c253aa81a3706ad6118c))
* **core:** remove own error management into wallet domain ([c7fd876](https://github.com/okp4/ui/commit/c7fd876f6754df62229fbe7c704808e94bd053d1))
* export Card component to main lib ([9928c62](https://github.com/okp4/ui/commit/9928c62d941ce2d98456cddebfb1e9b43b8e498c))
* initiated card and the story ([c0d5d3d](https://github.com/okp4/ui/commit/c0d5d3dd7c9f0c284c70af58af1d936094ae676e))
* make card extensible ([804a436](https://github.com/okp4/ui/commit/804a436e6f8c18c02e12774d8088d2edfc862847))
* notched corner ([6841bb5](https://github.com/okp4/ui/commit/6841bb5c12c47172d916fcf3facefdfd6827f237))
* notched corner operational ([c70a002](https://github.com/okp4/ui/commit/c70a002dc8ddb10014970934550831959b798603))
* **redux:** create error selectors ([21608b9](https://github.com/okp4/ui/commit/21608b9836e319de309a5dfbbeb4fb6e2987d322))
* **redux:** create redux store and reducers for error domain ([525bb3a](https://github.com/okp4/ui/commit/525bb3a3826d752dea2e4f6cab6947df5cabf469))
* **redux:** remove own error management from faucet store ([d25e3a9](https://github.com/okp4/ui/commit/d25e3a975a012c51d9c6a5718951258f8442f0b0))
* **redux:** remove own error management from wallet store ([0359886](https://github.com/okp4/ui/commit/0359886291b1e13a2556cd23393e50d4fc83e483))
* **redux:** remove typing from eventBus middleware ([fe87c96](https://github.com/okp4/ui/commit/fe87c968d6a8000ed7b7fb6743212e2ff2f2c170))
* style featured card ([8ea93d9](https://github.com/okp4/ui/commit/8ea93d934ce95b01760b8052c0b14a287cc17444))
* **style:** add disabled variables to palette and theme stylesheets ([f9b93b2](https://github.com/okp4/ui/commit/f9b93b2f7b144a27f5255554827b32ab50653ba0))
* tune bevel width ([e8f6bfc](https://github.com/okp4/ui/commit/e8f6bfc4680c421bf21d7620a278aa0bf8076df3))
* **ui:** enhance button component and associated style ([3dab86c](https://github.com/okp4/ui/commit/3dab86c95249259fbb8b0817a9a9010ee22f0824))
* variabilize background ([0175a98](https://github.com/okp4/ui/commit/0175a98f0ed673b7db85fcd889b76a0bebf01d6e))

# [1.2.0](https://github.com/okp4/ui/compare/v1.1.0...v1.2.0) (2022-04-19)


### Bug Fixes

* **config:** add rootDir to tsconfig ([91aa393](https://github.com/okp4/ui/commit/91aa3933a7d0ba3b69421810b2ac35c9e0658c87))
* **config:** remove all alliases to prevent tsc crash ([bb5b61f](https://github.com/okp4/ui/commit/bb5b61f7b06f3fc6ac895e4d2e020a78e40ec012))
* **config:** reverse rollup typescript plugin ([a7622b8](https://github.com/okp4/ui/commit/a7622b8d784afbe9d6584ed4472b31294cf81869))
* **config:** revert baseurl from tsconfig ([f813179](https://github.com/okp4/ui/commit/f8131791528d4933980da89994d9339f0a760bbf))
* export all superTypes to be compiled by tsc ([6ebe84a](https://github.com/okp4/ui/commit/6ebe84a924bd01c2d400e7e51924aa18fa4920b0))
* **lint:** add empty lines to separate scss rules in Logo.module.scss ([33dad9b](https://github.com/okp4/ui/commit/33dad9b8fb6ba9750d87ea29ffe67dd65ce043dc))
* **style:** adjust stylelint config + fix format issues ([d851277](https://github.com/okp4/ui/commit/d851277748542bb3aeda07aca1ca4c03f17cfc7b))
* **style:** decrease tranlateX value for switch thumb in dark mode ([93dd2de](https://github.com/okp4/ui/commit/93dd2deee9963ad7d90b60f085fb5814b85107b1))
* use https in gotham url ([852e704](https://github.com/okp4/ui/commit/852e704fd87e83710b0ec905c1be48226dc4a976))
* wrap Gotham black fontWeight into quotes ([6ab9ef5](https://github.com/okp4/ui/commit/6ab9ef5d6e3f29b7af944ca8f99d090e5d5d4437))


### Features

* **adapters:** implement faucet http and inmemory gateways ([38de580](https://github.com/okp4/ui/commit/38de580b398fed8e530aa4dae09b40f04ab61d00))
* **adapters:** implement primary adapater for faucet + declare wallet types ([bb3c48e](https://github.com/okp4/ui/commit/bb3c48ed2c9f98d07acaeb224e62060a2ce8b873))
* add a new (minimal) hook for fetching mediaTypes ([a0b401f](https://github.com/okp4/ui/commit/a0b401f6f255d5a88a44c0ae3ec62a2d4ccdcc32))
* add asMutable function (as the inverse of asImmutable) ([19d319d](https://github.com/okp4/ui/commit/19d319d23f2378092655835f4e34269f8b42505b))
* add properties to specify options for localstorage ([6ba5f6c](https://github.com/okp4/ui/commit/6ba5f6c14a3440c69b03bea59f4aaeed6e5d602a))
* add support for chain suggestion to Keplr extension ([f8d7348](https://github.com/okp4/ui/commit/f8d7348b6e905ae2b14f2fbf45fc66b2b64e30e1))
* add text component line height ([0ac699d](https://github.com/okp4/ui/commit/0ac699d3b24babf9103b93eb774cd0809b99b9f2))
* **assets:** add logos files in svg format ([460f32b](https://github.com/okp4/ui/commit/460f32b0d1653e086d72deacf1ef9a3e78e0f909))
* **assets:** move svg logos into dedicated folder ([34e18e3](https://github.com/okp4/ui/commit/34e18e3e7ba674f441638c47667fcd47308cedce))
* **component:** add svg icons and use them as react components in theme switcher ([a01741f](https://github.com/okp4/ui/commit/a01741fd214f8ba6ab7270d2e0ecfcaf1de364dc))
* **component:** implement Logo UI component and associated styles ([4a18dc2](https://github.com/okp4/ui/commit/4a18dc20ad4c3a492efab558b92bd87370517d82))
* **component:** load last saved theme at mount ([4c08db5](https://github.com/okp4/ui/commit/4c08db5db2437a29354080fd6d84c041e020b763))
* **component:** modify default exports from index files ([abae77b](https://github.com/okp4/ui/commit/abae77b9d49b592abe0276b7300a8d1568dcfc68))
* **config:** add new paths in tsconfig & adjust jest config ([f27f6ba](https://github.com/okp4/ui/commit/f27f6ba62a00fd07dbe5355da4ce04b8cce57603))
* **config:** configure copy plugin in rollup config ([dfa0636](https://github.com/okp4/ui/commit/dfa0636be5d3a9b67107e17ec97d02d386d20683))
* **config:** configure rollup typescript plugin + tsconfig ([42b6361](https://github.com/okp4/ui/commit/42b636193b4883bcf376ca2170e94b0dc877952d))
* **config:** disable canvas tab for all stories ([2c2fbe5](https://github.com/okp4/ui/commit/2c2fbe58b4ccf3dd77e2e00f044abbda5a617d75))
* **config:** enhance rollup + storybook configs ([aa84e1c](https://github.com/okp4/ui/commit/aa84e1c3e6a7bdf57bf262a2b5cb911a0634c7b6))
* **core:** add faucet port and entity ([ce02957](https://github.com/okp4/ui/commit/ce0295707e87ab8a839b1ac85ba158c7d1434eda))
* **core:** add new retrieve-address saga ([7c8b853](https://github.com/okp4/ui/commit/7c8b853305e2d3421e8758ad78c90c22e6885ece))
* **core:** add service to check bech32 address ([bb34c59](https://github.com/okp4/ui/commit/bb34c59ec246ef195627a6a1999308f151cc1a97))
* **core:** implement askTokens usecase ([aa2eb82](https://github.com/okp4/ui/commit/aa2eb8233dccbe700653dad45b15c33d62c321f1))
* **core:** implement setAddress usecase ([2eb8ce5](https://github.com/okp4/ui/commit/2eb8ce5cfee5ee77d05eccb726b5b3627fc1892f))
* **hook:** add useLocalStorage hook ([aca01d7](https://github.com/okp4/ui/commit/aca01d797a450bf866da239c73cab935297c59f5))
* **hooks:** export useTheme hook to be bundled by rollup ([a420136](https://github.com/okp4/ui/commit/a4201367b6055912ddf3bb904ede8ce0df13f4be))
* implement text input component and associated story [#99](https://github.com/okp4/ui/issues/99) ([dde6080](https://github.com/okp4/ui/commit/dde6080e34f7d984d9111335089cf63ffbabc2c3))
* implement typography component and associated story [#98](https://github.com/okp4/ui/issues/98) ([1da3750](https://github.com/okp4/ui/commit/1da37503235fc410c713af5926c2062e925f06ec))
* **logo:** improve svg imports and logo style ([c7a6d8e](https://github.com/okp4/ui/commit/c7a6d8ed865670f2387cc66e259a0b3a9b9dd183))
* **palette:** implement new colors by theme ([e85cc06](https://github.com/okp4/ui/commit/e85cc064f110229972e99fce4e4b8b45ba9d2c34))
* **project:** add more types to be exported to lib folder ([7f75982](https://github.com/okp4/ui/commit/7f7598293cb0fda5b0735221b102c22f834f3fa6))
* **project:** export Logo component to lib ([b5db024](https://github.com/okp4/ui/commit/b5db024be3d6dcaae9f860a4f4218f8fc8b9134b))
* **project:** remove useTheme from exports ([918e7b4](https://github.com/okp4/ui/commit/918e7b41c70a45a5a41587489b4078bca5ced618))
* **redux:** configure faucet store and reducers ([56fc80e](https://github.com/okp4/ui/commit/56fc80e0c7d7f04e79e6cd880e2471fe7956fab0))
* **redux:** create redux middleware to inject eventBus dispatch ([5c47017](https://github.com/okp4/ui/commit/5c47017bd3294021c63d7e81a6f75d9a1a25dda5))
* remove default values in props comment ([1bae98b](https://github.com/okp4/ui/commit/1bae98b85e5e4651283901d4c2870c1ffa9aa479))
* **rollup:** exclude logos folder from file loader rule + svg rule include ([c7190b3](https://github.com/okp4/ui/commit/c7190b33b5051ba5559f2f2d28df9ea40ceafb46))
* **stories:** add Logo associated stories ([03e2541](https://github.com/okp4/ui/commit/03e2541c96b8fa727c84f6650c59cd3f8ebe7e5b))
* **stories:** enhance logo story + add its own stylesheet ([e1947c0](https://github.com/okp4/ui/commit/e1947c0c784ad5183fa0a69286d106cc49ddb664))
* **stories:** enhance theme story and add custom stylesheet ([17b8eaa](https://github.com/okp4/ui/commit/17b8eaa0a703ef74dbab6f2d0af0d6051717052e))
* **stories:** expose properties for the component ThemeSwitcher ([d5c66a6](https://github.com/okp4/ui/commit/d5c66a68462a092e8c488f21a016158eed3588d2))
* **stories:** first theme story implementation ([2a47f93](https://github.com/okp4/ui/commit/2a47f933696addde6fd8f19ff35076ba81b753d0))
* **stories:** move folders + implement new colors stories ([7d7eff2](https://github.com/okp4/ui/commit/7d7eff293070f52c2a4c6b5641913e3ddd5670d8))
* **style:** export themes variables + enhance theme switcher css ([99e4482](https://github.com/okp4/ui/commit/99e4482e9e143c94d9ff7e8221ec19dc7d050e90))
* **text:** add new noWrap property & adjust classNames ([765c1c5](https://github.com/okp4/ui/commit/765c1c5a84a2047ba721ff4f52fcbf05c0d38db9))
* **theme:** declare themes and functions to themify rules ([63cc039](https://github.com/okp4/ui/commit/63cc0394688e0614b987fe9556a8ef9b87b4cfa2))
* **theme:** implement theme components and export them ([22a8ea9](https://github.com/okp4/ui/commit/22a8ea9da2a73d701866a8df34440dd2df31320a))
* use fonts as external url ([5894674](https://github.com/okp4/ui/commit/5894674a6571a1ea6e46697af9c47d2250e7e7c3))

# [1.1.0](https://github.com/okp4/ui/compare/v1.0.0...v1.1.0) (2022-03-22)


### Features

* **adapter:** handle error in WalletRegistryGateway get() method ([629ec54](https://github.com/okp4/ui/commit/629ec545a8cbda63521069e55129c51d72c8a0c0))
* **adapters:** add id method for existant gateways ([cea4333](https://github.com/okp4/ui/commit/cea4333a02a1471b28a4d4e7139bcaf9928e5e7e))
* **adapters:** add wallet gateways ([b68a2fd](https://github.com/okp4/ui/commit/b68a2fdf2f1ad167564ccb253e8221267aaf2036))
* **adapters:** enhance gateways ([863b090](https://github.com/okp4/ui/commit/863b09009be8fe39f83650a3cf2d78ebbdedb91a))
* **adapters:** implement getAccounts method in KeplrGateway ([aeb4081](https://github.com/okp4/ui/commit/aeb40817509809fe957db58ff89714d26f591da2))
* **adapters:** implement WalletRegistryGateway gateway ([4d341c1](https://github.com/okp4/ui/commit/4d341c1dceaa3ad228e381a7af0ce9b29d0f76d6))
* **adapters:** replace arrays and objects by immutable collections ([a039833](https://github.com/okp4/ui/commit/a039833b75d5c9730bdd35f4a4c54e2762aa6f2f))
* **ccore:** add enable-wallet usecase and associated spec ([62b956c](https://github.com/okp4/ui/commit/62b956c7be7be789d9d779ab2d687cc268b97300))
* **config:** add domain path to tsconfig.json ([8904b5b](https://github.com/okp4/ui/commit/8904b5b194e544e75e24a784d08bec2a7b7550b1))
* **config:** add eslint and prettier extended configurations ([b1d84f3](https://github.com/okp4/ui/commit/b1d84f3d0ca8284d55c6293e9985bca236c96e56))
* **config:** add strictNullChecks ts compiler option ([d83339b](https://github.com/okp4/ui/commit/d83339bea34e6caa3f7df5518b2045641d1a58c7))
* **core:** add account builder + DTO mapper ([0ee986e](https://github.com/okp4/ui/commit/0ee986efa9ba897729ec95f6f34d4bb941b03e7e))
* **core:** add account dispatch in wallet usecase ([e742896](https://github.com/okp4/ui/commit/e742896ec442ede57dee4390f0bc039ed1f831fc))
* **core:** add accounts entities + unspecified error ([ffd3ac7](https://github.com/okp4/ui/commit/ffd3ac776d3023cdd7d98f98485b1e59d2d4aacf))
* **core:** add algorithm property for Account entity ([7467225](https://github.com/okp4/ui/commit/74672250a4f13d9e9334bb06c54f2997b8b5a4a7))
* **core:** add getAccounts method to port ([1d0b0fb](https://github.com/okp4/ui/commit/1d0b0fbd09145cb2f1ba81909351881c34bfa5fa))
* **core:** add invariants for builder + builder test ([8883b8f](https://github.com/okp4/ui/commit/8883b8f2c646fa651833f9d4a8dcf21ec912a6cf))
* **core:** add isConnected method to main port ([89f8a5c](https://github.com/okp4/ui/commit/89f8a5cd1c8b0b9966289170608d375fb24f68c9))
* **core:** add wallet ports and entities ([645ca04](https://github.com/okp4/ui/commit/645ca041025c48a2ae7d9ff701fb01f2d0c37219))
* **core:** declare WalletRegistryPort main port ([af09812](https://github.com/okp4/ui/commit/af09812682bd30a3bd2f641ee7eb87fd4626497e))
* **core:** enhance error handling in enableWallet use-case ([3131de1](https://github.com/okp4/ui/commit/3131de16c42e6e7cba8d038da24edf26a532d40e))
* **core:** make account.builder an immutable class + update tests ([3af40bf](https://github.com/okp4/ui/commit/3af40bfcb474386183ba3d4389a0560c2e4ec64e))
* **core:** make domain entities immutable ([d6dd4c2](https://github.com/okp4/ui/commit/d6dd4c24cf5761cc9499c770c78946620e1f5c2b))
* **core:** modify enableWallet useCase to handle new gateway ([8089377](https://github.com/okp4/ui/commit/8089377537fa3ddf6a57611fa189ed881327f83d))
* **project:** add @keplr-wallet/types devDependency ([2b2350a](https://github.com/okp4/ui/commit/2b2350a4645cb07ad8429c3354ad8d26026da40b))
* **project:** add jest dependencies + config file ([460125a](https://github.com/okp4/ui/commit/460125a741d2f6b5c233d30dce23d98be0cfdcd1))
* **project:** add path for cosmjs dependency into tsconfig.json ([45dd637](https://github.com/okp4/ui/commit/45dd637b0fb994f9ea5b239792fdbe86a80e120f))
* **project:** add redux and redux-thunk dependencies ([d271938](https://github.com/okp4/ui/commit/d27193802cfe0d3611b384a8e1a180fc5077d3e9))
* **project:** add redux-devtools-extension devDependency ([824cf8e](https://github.com/okp4/ui/commit/824cf8e975d5ec916aa51a73e330eff476c055a4))
* **project:** fix all errors generated by new eslint config ([eea673d](https://github.com/okp4/ui/commit/eea673da5f1e8a1158a7dcdb9aea96841631ad91))
* **redux:** add accounts property in store, reducers and actionCreators ([8a7bf67](https://github.com/okp4/ui/commit/8a7bf671c7c607d9f55571c0d4a0d14e65f6b482))
* **redux:** configure store, reducers and actionCreators ([7e01f1f](https://github.com/okp4/ui/commit/7e01f1f0df69979de1e6b7d1f434a3a480d22c21))
* **redux:** make store immutable with immutable.js and make lint corrections ([0ba15cc](https://github.com/okp4/ui/commit/0ba15cc3973dd9364c8b13742295c487ee120520))
* **redux:** modify store dependencies ([80e53d5](https://github.com/okp4/ui/commit/80e53d5843e48e85f46f5ff694a1cd9ec820fdb6))
* **storybook:** add favicon image resources ([9d7bef8](https://github.com/okp4/ui/commit/9d7bef8a54ef5ffbfaa13187b29f203067160002))
* **storybook:** declare favicons in html header ([79fe7eb](https://github.com/okp4/ui/commit/79fe7eb05d7615f08991c75f98d7b8dd0054ff19))
* **storybook:** declare the folder "static" as static dir ([5a8f69c](https://github.com/okp4/ui/commit/5a8f69c7aa20f36f8798ec0ad1c8554ad96a3f20))
* **utils:** add superTypes and utils generics ([a4d00cd](https://github.com/okp4/ui/commit/a4d00cd53c7aa8174a176b841240112eff0222a6))
* **utils:** extend window global object wih Keplr ([1b39403](https://github.com/okp4/ui/commit/1b39403b502c03e5e5b819599ee62afc747c1515))

# 1.0.0 (2022-03-14)


### Bug Fixes

* change story name ([500c64a](https://github.com/okp4/ui/commit/500c64a57def34eb2195cde0e9a96bbdcbed85d0))
* **typo:** modify StorybookColorProps description ([9ca083b](https://github.com/okp4/ui/commit/9ca083b153e57f674a2eb8e7c38798a435c8f442))


### Features

* add animated option ([fbb7f60](https://github.com/okp4/ui/commit/fbb7f60ff31459b04901d070c3ff2229bb3e588d))
* add button component (for demo) ([7bd085c](https://github.com/okp4/ui/commit/7bd085c8977bb070056daba6b845b9794d6440e5))
* add Canvas componenent ([6c9a109](https://github.com/okp4/ui/commit/6c9a10938b72a1f2a42324fe3536abab54417e6f))
* add Canvas Component ([cba6982](https://github.com/okp4/ui/commit/cba6982a87625e0c792ab279e4f4602cec40bd01))
* add hook ([8c802d5](https://github.com/okp4/ui/commit/8c802d52a6c78c8a0734f27629793cd225d3e73e))
* describe in more details the philosophy of Atomic Design ([bf4d885](https://github.com/okp4/ui/commit/bf4d885ce20c20e7019ed11b249cbc447685d39a))
* explain some principles of the design ([dbb8b71](https://github.com/okp4/ui/commit/dbb8b711ac3ac7654883a67129c03bd5921394a4))
* improve cosmetic of site ([355a5ac](https://github.com/okp4/ui/commit/355a5ac910e01db9e67a8313a650183381169dd1))
* **storybook:** add colors story to present palette ([5c0ea75](https://github.com/okp4/ui/commit/5c0ea754e3f4a9afb8df38763c84e646c0aaa471))
* **storybook:** dissociate stories from components ([0a8ed7b](https://github.com/okp4/ui/commit/0a8ed7ba67210246ce47fddfc5f667c2257779c8))
* **storybook:** implement color components and utils consumed by palette story ([55b94f9](https://github.com/okp4/ui/commit/55b94f9f1f858cff4c427c4863f9bc30981f2bb5))
* **style:** implement colors palette ([eed4b7b](https://github.com/okp4/ui/commit/eed4b7b315ab5be60650b59ee88084932a2bb0dd))
