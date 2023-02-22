import { Add } from "@mui/icons-material";

import { useTable } from "@pankod/refine-core";

import { Typography, Box, Stack, TextField, Select, MenuItem} from '@pankod/refine-mui';

import { useNavigate } from "@pankod/refine-react-router-v6";

import { useMemo } from "react";

import { PropertyCard, CustomButton } from "components";

//za autentifikaciju
import { Refine, AuthProvider } from "@pankod/refine-core";
import { CredentialResponse } from "interfaces/google";
import { parseJwt } from "utils/parse-jwt";
import axios, { AxiosRequestConfig } from "axios";


const AllProperties = () => {
//authProvider objekat koji se koristi u React aplikacijama za upravljanje autentikacijom korisnika.
// Objekat ima pet funkcija: login, logout, checkError, checkAuth i getUserIdentity.
  const authProvider: AuthProvider = {

//login se poziva kada se korisnik uloguje. Ona prima podatke o korisnikovom autentifikacionom token-u kao argument.
// U ovoj funkciji se proverava da li je autentifikacioni token ispravan i, ako jeste, izdvoji se profileObj koji sadrži 
//podatke o korisniku. Zatim se korisnikov name, email i avatar sačuvaju u bazi podataka, a zatim se kreira objekat user 
//koji se skladišti u localStorage. Ako je korisnik admin, to se takođe označava u localStorage.
    login: async({ credential }: CredentialResponse) => {
      const profileObj = credential ? parseJwt(credential) : null;

      
      if(profileObj){
        const response = await fetch('http://localhost:8080/api/v1/users', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            name: profileObj.name,
            email: profileObj.email,
            avatar: profileObj.picture,
          })
        })

        const data = await response.json();

        if(response.status === 200) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...profileObj,
            avatar: profileObj.picture,
            userid:data._id
          })
        );
          // proveri da li je  admin i oznaci u bazi
          if (profileObj.email === "homenow.manager@gmail.com") {
            localStorage.setItem("isAdmin", "true");
          } else {
            localStorage.removeItem("isAdmin");
          }
        }
        else {
          //autentifikacija neuspesna
          return Promise.reject()
        }
      }     

      localStorage.setItem("token", `${credential}`);
    //autentifikacija uspesna
      return Promise.resolve();
    },

    //Funkcija logout se poziva kada se korisnik izloguje. Ona briše podatke o korisniku, token-u i postavlja isAdmin na null.
    logout: () => {
      const token = localStorage.getItem("token");

      if (token && typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("isAdmin");
        axios.defaults.headers.common = {};
        window.google?.accounts.id.revoke(token, () => {
          return Promise.resolve();
        });
      }

      return Promise.resolve();
    },
//Funkcija checkError se poziva kada se desi greška u autentikaciji.
    checkError: () => Promise.resolve(),

//Funkcija checkAuth se poziva kako bi se proverilo da li je korisnik ulogovan. 
//Ona proverava postoji li token u localStorage i u zavisnosti od toga, vraća Promise.resolve() ili Promise.reject().
    checkAuth: async () => {
      const token = localStorage.getItem("token");

      if (token) {
        return Promise.resolve();
      }
      return Promise.reject();
    },

    getPermissions: () => Promise.resolve(),
    //Funkcija getUserIdentity se poziva kako bi se dobili podaci o trenutno ulogovanom korisniku.
    // Ona proverava postoji li korisnik u localStorage i u zavisnosti od toga, vraća Promise.resolve() ili Promise.reject().
    getUserIdentity: async () => {
      const user = localStorage.getItem("user");
      if (user) {
        return Promise.resolve(JSON.parse(user));
      }
    },
  };
//kreranje promenjive isAdmin samo ukoliko je u bazi data kolona true
  const isAdmin = localStorage.getItem("isAdmin") === "true";


//za preusmeravanje na druge stranice u aplikaciji
  const navigate = useNavigate();


//useTable koji vraća objekat sa podacima o tabeli, trenutnoj stranici, broju stranica i opcijama za sortiranje i filtriranje.

  const {
    tableQueryResult: {data, isLoading, isError},
    current,
    setCurrent,
    setPageSize,
    pageCount,
    sorter, setSorter,
    filters, setFilters,
  } = useTable();


//koristi se opcionalni operator ?. da bi se izbeglo pristupanje undefined vrednostima 
//u objektu data. Ako data ne postoji, uzmemo prazan niz umesto undefined vrednosti.
  const allProperties = data?.data ?? [];

  
  //sortiranje po ceni
  const currentPrice = sorter.find((item) => item.field === 'price')?.order;

  const toggleSort = (field: string) => {
    setSorter([{ field, order: currentPrice === 'asc' ? 'desc' : 'asc'}])
  }

  {/* pretraga*/}
  // useMemo što znači da će se currentFilterValues izračunati samo ako je filters promenjen.
  const currentFilterValues = useMemo(() => {
    //metoda flatMap() prolazi kroz svaki element filters niza, a zatim vrši proveru da li taj
    // element ima svojstvo field - ('field' in item) proverava da li item sadrži svojstvo field.
    // Ako element ima svojstvo field, taj element se dodaje u novi niz logicalFilters. U suprotnom,
    // ako element nema svojstvo field, on se ne dodaje u niz.
    const logicalFilters = filters.flatMap((item) => ('field' in item ? item : []))

    return {
      //currentFilterValues omogućava filtriranje po nazivu nekretnine i tipu imovine.
      // Ako filter ne postoji, koristi se podrazumevana vrednost ''.
      title: logicalFilters.find((item) => item.field === 'title')?.value || '',
      propertyType: logicalFilters.find((item) => item.field === 'propertyType')?.value || '',
    }
  }, [filters])


  if(isLoading) return <Typography>Loading...</Typography>
  if(isError) return <Typography>Error...</Typography>

  return (
    <Box>
        <Box mt ="20px" sx={{display:"flex", flexWrap:"wrap", gap:3}}>
          <Stack direction="column" width="100%">
            <Typography fontSize={25} fontWeight={700} color="#11142d">
              {!allProperties.length ? 'There are no properties' : 'All Properties'}</Typography>
            <Box mb={2} mt={3} display='flex' width='84%' justifyContent="space-between" flexWrap="wrap">
                <Box display="flex" gap={2} flexWrap='wrap' marginBottom={{xs:'20px', sm: 0}}>
                    <CustomButton
                      title = {`Sort price ${currentPrice === 'asc' ? '↑' : '↓'}`}
                      handleClick={() => toggleSort('price')}
                      backgroundColor="#475be8"
                      color="#fcfcfc"
                    />

                    {/* pretraga*/}
                    <TextField
                      variant="outlined"
                      color="info"
                      placeholder="Search by title"
                      value={currentFilterValues.title}
                      onChange={(e) => {
                        setFilters([
                          {
                            field: 'title',
                            operator: 'contains',
                            value: e.currentTarget.value ? e.currentTarget.value : undefined
                          }
                      ])
                      }}
                    />
                    {/* pretraga po tipu nekretnine*/}
                    <Select
                      variant="outlined"
                      color="info"
                      displayEmpty
                      required
                      inputProps={{'aria-label': 'Without label'}}
                      defaultValue=""
                      value={currentFilterValues.propertyType}
                    onChange={(e) => {
                      setFilters([
                        {
                          field: 'propertyType',
                          operator: 'eq',
                          value: e.target.value
                        }
                    ], 'replace')
                  }}
                    >
                      {/*padajuca lista za tip nekretnine, mapira jedan po jedan i prikazuje u meniju malim slovima*/}
                      <MenuItem value="">All</MenuItem>
                      {['Apartment', 'Villa', 'Farmhouse', 'Condos', 'Townhouse', 'Duplex', 'Studio', 'Chalet'].map((type) => (
                          <MenuItem key={type} value={type.toLowerCase()}>{type}</MenuItem>
                      ))}
                    </Select>
                </Box>
            </Box>
          </Stack>
        </Box>






      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        
        {isAdmin ? null : (
          <CustomButton
            title="Add Property"
            //vodi na novu stranicu za kreiranje
            handleClick={() => navigate('/properties/create')}
            backgroundColor="#475be8"
            color="#fcfcfc"
            icon={<Add />}
          />
        )}

      </Stack>
      <Box mt = "20px" sx={{display:'flex', flexWrap:'wrap', gap: 3 }}>
        {allProperties.map((property) => (
          <PropertyCard 
          key={property._id}
          id={property._id}
          title = {property.title}
          price = {property.price}
          location = {property.location}
          photo = {property.photo}
  
          />
        ))}
      </Box>

          {/* paginacija*/}
          {allProperties.length > 0 && (
              <Box display="flex" gap={2} mt={3} flexWrap="wrap">
                  <CustomButton
                    title = {'Previous'}
                    /*racunanje trenutne stranice */
                    handleClick={() => setCurrent((prev) => prev - 1)}
                    backgroundColor="#475be8"
                    color="#fcfcfc"
                    disabled={!(current>1)}
                  />
                  <Box display={{xs:'hidden', sm:'flex'}} alignItems="center" gap="5px">
                      Page{' '}<strong>{current} of {pageCount}</strong>
                  </Box>
                  <CustomButton
                    title = {'Next'}
                    /*racunanje trenutne stranice */
                    handleClick={() => setCurrent((prev) => prev + 1)}
                    backgroundColor="#475be8"
                    color="#fcfcfc"
                    disabled={current === pageCount}
                  />
                  <Select 
                    variant="outlined"
                    color="info"
                    displayEmpty
                    required
                    inputProps={{'aria-label': 'Without label'}}
                    defaultValue={10}
                    onChange={(e) => setPageSize(
                      e.target.value ? Number(e.target.value) : 10
                    )}
                  >
                    {[10, 20, 30, 40, 50].map((size) => (
                      <MenuItem key={size} value={size}>Show {size}</MenuItem>
                    ))}
                  </Select>
              </Box>
          )}
    </Box>
  )
}

export default AllProperties