interface State {
    onEnter(): void;
    handle(context: Context): void;
    onExit(): void;
}

class PlayState implements State {
    handle(context: Context): void {
        context.setState(new PauseState());
    }

    onEnter(): void {
    }

    onExit(): void {
    }
}

class PauseState implements State {
    handle(context: Context): void {
        context.setState(new PlayState());
    }

    onEnter(): void {
    }

    onExit(): void {
    }
}

class SongState implements State {
    handle(context: Context): void {
        context.setState(new SongState());
    }

    onEnter(): void {
    }

    onExit(): void {
    }
}

class Context {
    private state: State;

    constructor(initialState: State) {
        this.state = initialState;
    }

    public setState(state: State) {
        this.state = state;
    }

    public request() {
        this.state.handle(this);
    }
}
