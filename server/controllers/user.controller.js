import User from "../mongodb/models/user.js";

const getAllUsers = async (req, res) => {
    try {
        //vracaju se korisnici ali u ogranicenom broju
        const users = await User.find({}).limit(req.query._end);

        //ukoliko je nasao salju se svi korisnici
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const createUser = async (req, res) => {
    try {
        //telo http zahteva
        const { name, email, avatar } = req.body;

        //provera da li postoji po mejlu
        const userExists = await User.findOne({ email });

        //ako postoji vraca te podatke
        if (userExists) return res.status(200).json(userExists);

        //ako ne, pravi novog usera
        const newUser = await User.create({
            name,
            email,
            avatar,
        });

        //vraca podatke tog novog usera
        res.status(200).json(newUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserInfoByID = async (req, res) => {
    try {
        //na osnovu ida
        const { id } = req.params;

        //da se uzmu sve nekretnine koje je korisnik napravio
        const user = await User.findOne({ _id: id }).populate("allProperties");

        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { getAllUsers, createUser, getUserInfoByID };