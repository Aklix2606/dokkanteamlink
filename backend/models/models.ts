// Tabla: gremi
export interface Gremi {
    nom_gremi: string;
}

// Tabla: jugador
export interface Jugador {
    correu: string;
    contrasenya: string;
    nom_gremi: string;
}

// Tabla: ededeveniment
export interface Esdeveniment {
    nomedeveniment: string;
}

// Tabla: participacioedeveniment
export interface Participacioesdeveniment {
    correu: string;
    nomedeveniment: string;
    puntuacioedeveniment: number;
    data_event: Date;
}

// Tabla: personatge
export interface Personatge {
    nom: string;
    tipus: string;
    vida: number;
    atac: number;
    defensa: number;
}

// Tabla: objecte
export interface Objecte {
    numobj: number;
    tipusobj: string;
    correu: string;
}

// Tabla: bescanvi
export interface Bescanvi {
    nom_gremi: string;
    nomedeveniment: string;
}

// Tabla: component
export interface Component {
    nomequip: string;
    nom: string;
}

// Tabla: personatjeequipocat
export interface Personatgeinvocat {
    correu: string;
    nom: string;
    numobj: number;
}

// Tabla: androide
export interface Androide {
    nom: string;
    quantitat: number;
}

// Tabla: humà
export interface Huma {
    nom: string;
    nivell_poder: number;
}

// Tabla: saiyan
export interface Saiyan {
    nom: string;
    transformacio: string;
}

// Tabla: participacioedevenimentgremi
export interface Participacioedevenimentgremi {
    nom_gremi: string;
    nomedevenimentgremi: string;
    puntuacioedevenimentgremi: number;
    recompensaespecial: string;
}
export interface Equip{
    nomequip: string;
    correu: string;

}