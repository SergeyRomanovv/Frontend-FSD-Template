import MiniCssExtractPlugin from 'mini-css-extract-plugin';

export function buildCssLoader(isDev: boolean) {
    return {
        test: /\.s[ac]ss$/i,
        exclude: /node_modules/,
        use: [
            isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
            {
                loader: 'css-loader',
                options: {
                    modules: {
                        auto: (resPath: string) => Boolean(resPath.includes('.module.')),
                        localIdentName: isDev
                            ? '[path][name]__[local]--[hash:base64:5]'
                            : '[hash:base64:8]',
                        // css-loader@7: сохраняем экспорт имён as-is (иначе .Button -> 'button', ломая все uppercase классы)
                        exportLocalsConvention: 'asIs',
                        namedExport: false,
                    },
                },
            },
            {
                loader: 'sass-loader',
                options: {
                    sassOptions: {
                        // Глушим deprecation-предупреждение о @import (миграция на @use/@forward — отдельный этап)
                        silenceDeprecations: ['import'],
                    },
                },
            },
        ],
    };
}
