const ListInventory = async (url: string, token: string): Promise<Response> => {
  try {
    const response = await fetch(`http://${url}/v1/inventory/list`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Origin': 'http://localhost:3000'
      },
      credentials: 'include'
    });
    return response;
  } catch (error) {
    console.error('Error fetching inventory:', error);
    throw error;
  }
}

export default ListInventory;