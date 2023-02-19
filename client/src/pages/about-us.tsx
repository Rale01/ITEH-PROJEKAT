import { Typography, Box, Stack } from "@pankod/refine-mui";
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import {Place} from "@mui/icons-material";

const AboutUs = () => {
    return (
       <Box
            borderRadius="15px"
            padding="20px"
            bgcolor="#FCFCFC"
            width="fit-content"
            marginLeft="35px"

       >
            <Typography  fontSize={25} fontWeight={700} color="#11142D" > About Us  <HomeWorkIcon></HomeWorkIcon> </Typography>
            <Box 
                mt="20px"
                display="flex"
                flexDirection={{ xs: "column", lg: "row" }}
                gap={4}
            >
                <Box flex={1} maxWidth={1600} >
                    <img
                        src='https://www.peoplespropertypoint.com/wp-content/uploads/2022/09/Top-10-property-dealers-in-Mohali.jpg'
                        alt="property_details-img"
                        height={700}
                        width={1600}
                        style={{ objectFit: "cover", borderRadius: "10px" }}
                        className="property_details-img"
                    />

                    <Box  mt="15px" >
                            <Box>
                                <Typography
                                    fontSize={22}
                                    fontWeight={600}
                                    mt="10px"
                                    color="#11142D"
                                >
                                    About our company:
                                </Typography>
                                <Stack
                                    mt={0.5}
                                    direction="row"
                                    alignItems="center"
                                    gap={0.5}
                                >
                                    <Place sx={{ color: "#808191" }} />
                                    <Typography fontSize={14} color="#808191">
                                        Situated in New York
                                    </Typography>
                                </Stack>
                            </Box>

                            <Stack mt="25px" direction="column" gap="10px">
                            <Typography fontSize={18} color="#11142D" textAlign="justify" padding="10px">
                            The real estate agency HOMENOW is dedicated to providing quality services to its clients. With a team of 
                            experienced and knowledgeable professionals, they are committed to helping people find their dream home. 
                            Whether it's a house, studio, apartment, condo, farmhouse, or villa, the agency has a wide selection of 
                            properties to choose from. The team works closely with clients to understand their unique needs and 
                            preferences and offers personalized recommendations to ensure that they find the perfect home. The agency's 
                            mission is to make the home buying process as easy and stress-free as possible for its clients, from the 
                            initial search to closing the deal. With a reputation for excellence and a commitment to customer satisfaction, 
                            the agency is a trusted partner in the real estate market.
                            </Typography>
                            </Stack>

                    </Box>

                </Box>

            </Box>
       </Box>
    )
}

export default AboutUs;