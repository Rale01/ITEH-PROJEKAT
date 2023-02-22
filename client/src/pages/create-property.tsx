import { useState } from 'react';

import { useGetIdentity } from '@pankod/refine-core';

import { FieldValues, useForm } from '@pankod/refine-react-hook-form';

import { useNavigate } from '@pankod/refine-react-router-v6';

import Form from 'components/common/Form'


const CreateProperty = () => {

  const navigate = useNavigate();
  const { data : user } = useGetIdentity();
  const [propertyImage, setPropertyImage] = useState({name: '', url: ''});
  //useForm je hook koji se koristi u Refine aplikacijama kako bi se kreirao i validirao formular.
  const { refineCore: { onFinish, formLoading}, register, handleSubmit} = useForm();


  //U handleImageChange se definise funkcija za promenu slike za nekretninu. 
  //Ova funkcija prima fajl kao argument, zatim se kreira novi Promise koji koristi FileReader API kako bi se 
  //pretvorio fajl u Data URL, nakon cega se stanje propertyImage azurira sa novim imenom i URL-om.
  const handleImageChange = (file: File) => {
    const reader = (readFile: File) => new Promise<string>((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = () => resolve(fileReader.result as string);
      fileReader.readAsDataURL(readFile);
    });

    reader(file).then((result: string) => setPropertyImage({ name: file?.name, url: result }));
  };

//U onFinishHandler se definise funkcija koja se poziva kada se formular za kreiranje nekretnine zavrsi. 
//Prvo se proverava da li je korisnik dodao sliku za nekretninu. Ako nije, prikazuje se upozorenje
  const onFinishHandler = async (data:FieldValues) => {
    if (!propertyImage.name) return alert('Please upload a property image');
    // u suprotnom poziva se onFinish funkcija i salju se podaci formulara, URL slike za nekretninu i email korisnika.
    await onFinish({ ...data, photo: propertyImage.url, email: user.email });
  };

  return (
    //Form je komponenta koja se koristi za kreiranje formulara.
    <Form
      type="Create"
      register= {register}
      onFinish={onFinish}
      formLoading={formLoading}
      handleSubmit={handleSubmit}
      handleImageChange={handleImageChange}
      onFinishHandler={onFinishHandler}
      propertyImage={propertyImage}
    />
  )
}

export default CreateProperty