const CracoLessPlugin = require("craco-less");
const { whenProd } = require("@craco/craco");
// const BundleAnalyzerPlugin =
//   require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const CompressionWebpackPlugin = require("compression-webpack-plugin");

// 查看打包时间
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();

const overrideConfig = {

  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              "@primary-color": "#457fca",
              "border-radius-base": "15px",
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
  babel: {
    plugins: [
      [
        "import",
        {
          libraryName: "antd",
          libraryDirectory: "lib",
          style: true,
        },
      ],
    ],
  },
  webpack: smp.wrap({
    plugins: whenProd(()=>[
      //new BundleAnalyzerPlugin(),
      new CompressionWebpackPlugin({
          filename: "[path][base].gz",
          algorithm: 'gzip',// 使用gzip压缩
          test: new RegExp(
              '\\.(js|css)$' // 压缩 js 与 css
          ),
          threshold: 8192,// 资源文件大于8192B时会被压缩
          minRatio: 0.8, // 最小压缩比达到0.8时才会被压缩
          deleteOriginalAssets: false,
        })
    ],[]),
    configure: whenProd(() => {
      return {
        mode: "production",
      };
    }, {}),
  }),
};

module.exports = overrideConfig;
