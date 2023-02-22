import { BaseKey } from '@pankod/refine-core';

//AgentCardProp definiše propertije koji su dostupni u komponenti AgentCard. 
//Ova komponenta se koristi za prikaz informacija o jednom agentu.
export interface AgentCardProp {
    id?: BaseKey | undefined,
    name: string,
    email: string,
    avatar: string,
    noOfProperties: number
}

//InfoBarProps definiše propertije za komponentu InfoBar. 
//Ova komponenta se koristi za prikazivanje informacija o agenciji ili o nekoj nekretnini(ikonica i ime)
export interface InfoBarProps {
    icon: ReactNode,
    name: string
}
