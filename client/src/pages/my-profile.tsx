import { useGetIdentity, useOne } from "@pankod/refine-core";

import { Profile } from "components";

const MyProfile = () => {
    const { data: user } = useGetIdentity();

    //useOne kuka se koristi za dobijanje detalja o jednom zapisu iz API-ja. U ovom slučaju, 
    //koristi se za dobijanje detalja o trenutno prijavljenom korisniku tako što se prosleđuje resource 
    //kao "users", a id kao id trenutno prijavljenog korisnika.
    const { data, isLoading, isError } = useOne({
        resource: "users",
        //Izraz data?.id je JavaScript opcioni lanac (optional chaining operator) koji se koristi 
        //kada se pokušava pristupiti svojstvu objekta koji možda ne postoji (tj. ima vrednost undefined).
        id: user?.userid,
    });

    //koristi se opcionalni operator ?. da bi se izbeglo pristupanje undefined vrednostima 
    //u objektu data. Ako data ne postoji, uzmemo prazan niz umesto undefined vrednosti.
    const myProfile = data?.data ?? [];

    if (isLoading) return <div>loading...</div>;
    if (isError) return <div>error...</div>;

    return (
        <Profile
            type="My"
            name={myProfile.name}
            email={myProfile.email}
            avatar={myProfile.avatar}
            properties={myProfile.allProperties}
        />
    );
};

export default MyProfile;