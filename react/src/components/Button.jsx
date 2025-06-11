import React from "react";

function Button({ className="", ...props}) {
    return (
        <button className={`${className}`} { ...props} />
    );
}

export default Button;
