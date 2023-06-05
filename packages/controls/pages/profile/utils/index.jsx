export const formatterUserDataForSend = (data) => {
  if (data.phone) {
    data.phone = data.phone ? data.phone.replace(/\D/g, '') : '';
  }

  return data;
}