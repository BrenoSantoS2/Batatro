module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Adicione esta linha para o plugin do Reanimated
      'react-native-reanimated/plugin',
    ],
  };
};