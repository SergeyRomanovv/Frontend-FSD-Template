import { useTranslation } from 'react-i18next';
import { Page } from '@/widgets/Page';

export const ErrorPage = () => {
    const { t } = useTranslation();

    return (
        <Page data-testid="ErrorPage">
            {t('Произошла непредвиденная ошибка')}
        </Page>
    );
};
