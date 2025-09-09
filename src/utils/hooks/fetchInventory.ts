const ListInventory = (url: string, token: string): Promise<Response> => {
  const response = fetch(`http://${url}/v1/inventory/list`,{
    method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Origins': 'http://localhost:3000'
      },
      credentials: 'include'
  })
  return response
}

export default ListInventory;