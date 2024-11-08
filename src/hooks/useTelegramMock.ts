import { useClientOnce } from '@/hooks/useClientOnce';
import { mockTelegramEnv, parseInitData, retrieveLaunchParams } from '@telegram-apps/sdk-react';

/**
 * Mocks Telegram environment in development mode.
 */
export function useTelegramMock(): void {
  useClientOnce(() => {
    // It is important, to mock the environment only for development purposes. When building the
    // application, import.meta.env.DEV will become false, and the code inside will be tree-shaken,
    // so you will not see it in your final bundle.

    let shouldMock: boolean;

    // Try to extract launch parameters to check if the current environment is Telegram-based.
    try {
      // If we are able to extract launch parameters, it means that we are already in the
      // Telegram environment. So, there is no need to mock it.
      retrieveLaunchParams();

      // We could previously mock the environment. In case we did, we should do it again. The reason
      // is the page could be reloaded, and we should apply mock again, because mocking also
      // enables modifying the window object.
      shouldMock = !!sessionStorage.getItem('____mocked');
    } catch (e) {
      shouldMock = true;
    }

    if (shouldMock) {
      const initDataRaw = new URLSearchParams([
        ['user', JSON.stringify({
          id: 5090981477,
          first_name: 'Yaroslav',
          last_name: 'Koval',
          username: 'KovalYRS',
          language_code: 'en',
          allows_write_to_pm: true
        })],
        ['chat_instance', '8498779124332473527'],
        ['chat_type', 'private'],
        ['auth_date', '1719945821'],
        ['hash', 'de212828a9569cad370ec7e97017e158f5b72ce3f8336b1a96ad1b9aba668a4b']
      ]).toString();

      mockTelegramEnv({
        themeParams: {
          accentTextColor: '#2481cc',
          bgColor: '#ffffff',
          buttonColor: '#2481cc',
          buttonTextColor: '#ffffff',
          destructiveTextColor: '#ff3b30',
          headerBgColor: '#efeff3',
          hintColor: '#999999',
          linkColor: '#2481cc',
          secondaryBgColor: '#efeff3',
          sectionBgColor: '#ffffff',
          sectionHeaderTextColor: '#6d6d71',
          subtitleTextColor: '#999999',
          textColor: '#000000'
        },
        initData: parseInitData(initDataRaw),
        initDataRaw,
        version: '7.2',
        platform: 'tdesktop',
      });
      sessionStorage.setItem('____mocked', '1');

      console.info(
        'As long as the current environment was not considered as the Telegram-based one, it was mocked. Take a note, that you should not do it in production and current behavior is only specific to the development process. Environment mocking is also applied only in development mode. So, after building the application, you will not see this behavior and related warning, leading to crashing the application outside Telegram.',
      );
    }
  });
}