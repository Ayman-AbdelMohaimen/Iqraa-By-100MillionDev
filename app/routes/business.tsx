import { createFileRoute } from '@tanstack/react-router';
import { BusinessPage } from '../components/business/BusinessPage';

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/{-$locale}/business': {
      id: '/{-$locale}/business';
      path: '/business';
      fullPath: '/{-$locale}/business';
      preLoaderRoute: any;
      parentRoute: any;
    };
  }
}

export const Route = createFileRoute('/{-$locale}/business')({
  head: () => ({
    meta: [
      { title: 'حلول المؤسسات والشركات | منصة اقرأ' },
      {
        name: 'description',
        content: 'حلول متكاملة وتوريد أجهزة الحبر الإلكتروني BOOX للمدارس والجامعات والشركات والجهات الحكومية في المملكة العربية السعودية.',
      },
    ],
  }),
  component: BusinessComponent,
});

function BusinessComponent() {
  return <BusinessPage />;
}
