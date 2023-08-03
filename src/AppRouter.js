import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { HomePage } from './pages/HomePage';
import { PokedexPage } from './pages/PokedexPage';
import { SearchPage } from './pages/SearchPage';

export const AppRouter = () => {
	return (
		<Routes>
			<Route path="/" element={<Navigation />}>
				<Route index element={<HomePage />} />
				<Route path="pokemon/:id" element={<PokedexPage />} />
				<Route path="search" element={<SearchPage />} />
			</Route>
			<Route path="*" element={<Navigate to="/" />} />
		</Routes>
	);
};

export default AppRouter;
