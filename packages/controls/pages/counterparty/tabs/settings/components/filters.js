


const filterFullName = (data, input) => {
  if (!input) return data;
  const lowerInput = input.toLowerCase();

  return data.filter(el => el.fullName?.toLowerCase().match(lowerInput))

}

const filterEmail = (data, input) => {
  if (!input) return data;
  const lowerInput = input.toLowerCase();

  return data.filter(el => el.email?.toLowerCase().match(lowerInput))

}

const filterData = (data, params) => {
  if (!params) return data;
  return filterEmail(filterFullName(data, params?.fullName), params?.email)
}

export { filterFullName, filterEmail, filterData };