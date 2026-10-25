interface ButtonsProps {
    lb: () => void;
    rb: () => void;
}

export const PaginationButtons = ({lb,  rb} : ButtonsProps) => {
    return (
        <div>
            <button onClick={lb}>
                {"<"}
            </button>

            <button onClick={rb}>
                {">"}
            </button>
        </div>
    )
}