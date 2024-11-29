import "./App.css";
import { Game } from "./components/game";
import { GameProvider } from "./domain/tic-tac-toe";

function App() {
	return (
		<>
			<GameProvider>
				<Game>
					<Game.Board />
					<Game.Meta />
				</Game>
			</GameProvider>
		</>
	);
}

export default App;
