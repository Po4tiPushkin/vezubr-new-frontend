import { showError } from '@vezubr/elements';
import moment from 'moment';

export function showEditError(e) {

  if (e.code === 422) {
    let timeEgo = '';

    if (e?.data?.lastActive) {
      timeEgo =`Было в сети ${moment.utc(e.data.lastActive * 1000).local().fromNow()}.`;
    }

    const content = `Мобильное приложение водителя не в сети. ${timeEgo} Для сохранения изменений попросите водителя обеспечить интернет соединение и перезагрузить заказ.`;

    showError(e, {
      content,
    });

    return;
  }

  showError(e);
}