const pais = async (country) => {
    const response = await fetch('https://restcountries.com/v3.1/name/' + country);
    if (response.status != 200) {
        throw new Error('Não é possível ler os dados!');
    }
    const data = await response.json();

    return data;
}

export default pais;