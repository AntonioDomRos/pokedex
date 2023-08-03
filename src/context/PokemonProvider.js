import { useEffect, useState } from 'react';
import { useForm } from '../hook/useForm';
import { PokemonContext } from './PokemonContext';

export const PokemonProvider = ({ children }) => {
	const [allPokemons, setallPokemons] = useState([]);
	const [globalPokemons, setglobalPokemons] = useState([]);
	const [offset, setoffset] = useState(0);

	//Custom hook para formularios
	const { valueSearch, onInputChange, onResetForm } = useForm({
		valueSearch: '',
	});

	//Estados de carga
	const [loading, setloading] = useState(true);
	const [active, setactive] = useState(false);

	//Llamada de 50 Pokemones de la API
	const getAllPokemons = async (limit = 50) => {
		const baseUrl = 'https://pokeapi.co/api/v2/';
		const res = await fetch(
			`${baseUrl}pokemon?limit=${limit}&offset=${offset}`
		);
		const data = await res.json();

		const promises = data.results.map(async (pokemon) => {
			const res = await fetch(pokemon.url);
			const data = await res.json();
			return data;
		});
		const results = await Promise.all(promises);

		setallPokemons([...allPokemons, ...results]);
		setloading(false);
	};

	// Llamada global de los Pokemons
	const getGlobalPokemons = async () => {
		const baseUrl = 'https://pokeapi.co/api/v2/';
		const res = await fetch(`${baseUrl}pokemon?limit=100000&offset=0`);
		const data = await res.json();

		const promises = data.results.map(async (pokemon) => {
			const res = await fetch(pokemon.url);
			const data = await res.json();
			return data;
		});
		const results = await Promise.all(promises);

		setglobalPokemons(results);
		setloading(false);
	};

	//Llamada por ID
	const getPokemonById = async (id) => {
		const baseUrl = 'https://pokeapi.co/api/v2/';
		const res = await fetch(`${baseUrl}pokemon/${id}`);
		const data = await res.json();
		return data;
	};

	useEffect(() => {
		getAllPokemons();
	}, [offset]);

	useEffect(() => {
		getGlobalPokemons();
	}, []);

	// Cargar más
	const onClickLoadMore = () => {
		setoffset(offset + 50);
	};

	// Filter functions
	const [typeSelected, setTypeSelected] = useState({
		grass: false,
		normal: false,
		fighting: false,
		flying: false,
		poison: false,
		ground: false,
		rock: false,
		bug: false,
		ghost: false,
		steel: false,
		fire: false,
		water: false,
		electric: false,
		psychic: false,
		ice: false,
		dragon: false,
		dark: false,
		fairy: false,
		unknow: false,
		shadow: false,
	});
	const [filteredPokemons, setFilteredPokemons] = useState([]);
	const handleCheckbox = (e) => {
		setTypeSelected({
			...typeSelected,
			[e.target.name]: e.target.checked,
		});

		if (e.target.checked) {
			const filteredResults = globalPokemons.filter((pokemon) =>
				pokemon.types.map((type) => type.name).includes(e.target.name)
			);
			setFilteredPokemons([...filteredPokemons, ...filteredResults]);
		} else {
			const filteredResults = filteredPokemons.filter(
				(pokemon) =>
					!pokemon.types.map((type) => type.name).includes(e.target.name)
			);
			setFilteredPokemons([...filteredResults]);
		}
	};

	return (
		<PokemonContext.Provider
			value={{
				valueSearch,
				onInputChange,
				onResetForm,
				allPokemons,
				globalPokemons,
				getPokemonById,
				onClickLoadMore,
				// Loader
				loading,
				setloading,
				// Btn filter
				active,
				setactive,
				// Filter container checkbox
				handleCheckbox,
				filteredPokemons,
			}}
		>
			{children}
		</PokemonContext.Provider>
	);
};

export default PokemonProvider;
