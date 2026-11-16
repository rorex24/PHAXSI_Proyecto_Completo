import React from 'react';

export const PrimerosAuxilios = () => {
    return (
        <div>
            <h2 style={{ marginBottom: '1rem' }}>Guía de Primeros Auxilios ante Crisis Epilépticas</h2>
            
            <div className="grid-2">
                <div className="card" style={{ borderLeft: '5px solid var(--success-color)' }}>
                    <h3 style={{ color: 'var(--success-color)', marginBottom: '1rem' }}>Qué hacer durante una crisis</h3>
                    <ul style={{ paddingLeft: '1.2rem' }}>
                        <li>Mantenga la calma y acompañe a la persona.</li>
                        <li>Tome el tiempo de duración de la crisis.</li>
                        <li>Coloque a la persona de lado (posición lateral de seguridad) para evitar atragantamientos.</li>
                        <li>Proteja la cabeza con algo suave (almohada o prenda doblada).</li>
                        <li>Afloje ropa ajustada alrededor del cuello (corbatas, botones).</li>
                    </ul>
                </div>

                <div className="card" style={{ borderLeft: '5px solid var(--danger-color)' }}>
                    <h3 style={{ color: 'var(--danger-color)', marginBottom: '1rem' }}>Qué NO se debe hacer</h3>
                    <ul style={{ paddingLeft: '1.2rem' }}>
                        <li>NO introduzca nada en la boca de la persona.</li>
                        <li>NO intente sujetar o contener sus movimientos.</li>
                        <li>NO intente dar agua, alimentos o medicamentos por la boca durante la crisis.</li>
                        <li>NO realice respiración boca a boca salvo indicación expresa tras la crisis.</li>
                    </ul>
                </div>
            </div>

            <div className="card" style={{ backgroundColor: '#fff5f5', borderColor: '#feb2b2' }}>
                <h3 style={{ color: 'var(--danger-color)', marginBottom: '0.5rem' }}>¿Cuándo llamar a una ambulancia urgente?</h3>
                <ul style={{ paddingLeft: '1.2rem' }}>
                    <li>Si la crisis dura más de 5 minutos.</li>
                    <li>Si la persona tiene dificultad para respirar tras la crisis.</li>
                    <li>Si ocurre una segunda crisis inmediatamente después de la primera.</li>
                    <li>Si la persona está embarazada, lesionada o padece otra afección de salud.</li>
                </ul>
            </div>
        </div>
    );
};
