import { store } from 'react-notifications-component';

export const errorNotification = (title: string, message: string) => {
  store.addNotification({
    title,
    message,
    type: 'danger',
    insert: 'top',
    container: 'top-right',
    animationIn: ['animated', 'flipInX'],
    animationOut: ['animated', 'flipOutX'],
    dismiss: {
      duration: 6000,
      onScreen: true,
      pauseOnHover: true,
      showIcon: true,
    },
  });
};
