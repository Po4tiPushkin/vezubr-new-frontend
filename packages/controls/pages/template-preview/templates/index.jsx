import { WhiteBox } from '@vezubr/elements';
import React from 'react';
import './styles.scss'

export default function RequestTemplate({ fields }) {
  return (
    <WhiteBox className='request-template'>
      <h4>ЗАЯВКА. / ДОГОВОР-ЗАЯВКА.</h4>
      <p className="centre">
        № ____ от __.__.____ г.
      </p>

      <p>Заказчик: / Тип ТС:</p>
      <p>Исполнитель: / Тип кузова:</p>

      <br />

      <table className="main">
        <tr>
          <td width="15%" rowSpan="4">Адрес погрузки</td>
          <td colSpan='3'>Адрес:</td>
        </tr>
        <tr>
          <td colSpan='3'>Дата и время:</td>
        </tr>
        <tr>
          <td colSpan='3'>Компания грузоотправитель/грузополучатель:</td>
        </tr>
        <tr>
          <td colSpan='3'>Фио, номер телефона и доб.: </td>
        </tr>
        
        <tr>
          <td width="15%" rowSpan="4">Промежуточный адрес</td>
          <td colSpan='3'>Адрес:</td>
        </tr>
        <tr>
          <td colSpan='3'>Дата и время:</td>
        </tr>
        <tr>
          <td colSpan='3'>Компания грузоотправитель/грузополучатель:</td>
        </tr>
        <tr>
          <td colSpan='3'>Фио, номер телефона и доб.: </td>
        </tr>

        <tr>
          <td width="15%" rowSpan="4">Адрес отгрузки</td>
          <td colSpan='3'>Адрес:</td>
        </tr>
        <tr>
          <td colSpan='3'>Дата и время:</td>
        </tr>
        <tr>
          <td colSpan='3'>Компания грузоотправитель/грузополучатель:</td>
        </tr>
        <tr>
          <td colSpan='3'>Фио, номер телефона и доб.: </td>
        </tr>

        <tr>
          <td rowSpan="4">Груз</td>
          <td colSpan='3'>Кол-во мест (палл):</td>
        </tr>
        <tr>
          <td colSpan='3'>Вес (т), Объем (м3):</td>
        </tr>
        <tr>
          <td colSpan='3'>Категория груза:</td>
        </tr>
        <tr>
          <td colSpan='3'>Объявленная стоимость:</td>
        </tr>

        <tr>
          <td rowSpan="4">Транспорт</td>
          <td colSpan='3'>Тип ТС и Тип кузова: </td>
        </tr>
        <tr>
          <td colSpan='3'>Марка ТС: </td>
        </tr>
        <tr>
          <td colSpan='3'>Регистрационный номер: </td>
        </tr>
        <tr>
          <td colSpan='3'>Доп параметры ТС:</td>
        </tr>

        <tr>
          <td rowSpan="3">Водитель</td>
          <td colSpan='3'>ФИО, номер телефона: , </td>
        </tr>
        <tr>
          <td colSpan='3'>
            Паспортные данные: <br />
            Выдан:
          </td>
        </tr>
        <tr>
          <td colSpan='3'>Водительское удостоверение:</td>
        </tr>

        <tr>
          <td rowSpan="2">
            Стоимость <br />
            перевозки
          </td>
          <td colSpan='3'>Без НДС:</td>
        </tr>
        <tr>
          <td colSpan='3'>Срок оплаты: Согласно договору</td>
        </tr>

        {
          fields.map(({title, value}) => (
            <tr>
              <td className='bold'>{title}</td>
              <td colSpan='3' className='bold' style={{
                wordBreak: value?.indexOf(' ') !== -1 ? 'break-word' : 'break-all'
              }}>{value}</td>
            </tr>
          ))
        }
        <tr>
          <td colSpan={'2'} style={{width: '50%'}}>
            Реквизиты Заказчика:
            <br />
            <br />
            ИНН: <br />
            Адрес:
          </td>
          <td colSpan={'2'}>
            Реквизиты Подрядчика:
            <br />
            <br />
            ИНН: <br />
            Адрес:
          </td>
        </tr>
        
      </table>

      <br />
      <br />
      <br />
      <br />

      <table className="signatures">
        <tr>
          <td>Подпись заказчика __________________</td>
          <td>Подпись исполнителя __________________</td>
        </tr>
      </table>
    </WhiteBox>
  );
}
