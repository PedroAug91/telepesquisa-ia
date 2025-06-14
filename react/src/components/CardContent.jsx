import React from "react";

function CardContent({ children, className="" }) {
    return (
        <div className={`${className}`}>
            { children }
        </div>
    );
}

export default CardContent;
