import React from 'react';

export default function ApplicationLogo(props) {
    return (
        <img 
            {...props} 
            src="/icons/logo.png" 
            alt="Wisma Domba Logo" 
            onError={(e) => {
                e.target.onerror = null; 
                e.target.src = "https://placehold.co/200x200/2B5E41/FFFFFF?text=WD+Logo";
            }}
            className={`object-contain ${props.className || ''}`} 
        />
    );
}
