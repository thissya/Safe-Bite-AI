import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom";
import img1 from "../assets/img1.jpg";
import img2 from "../assets/img2.jpg";

function Home() {
    const navigate = useNavigate();

    return (
        <div className="flex-row text-center pb-8 border-b border-neutral-900">
            <motion.h1
                whileInView={{ y: 0, opacity: 1 }}
                initial={{ y: -100, opacity: 0 }}
                transition={{ duration: 1 }}
                className="my-8 text-center text-5xl font-serif text-purple-400"
            >
                CONFIDENCE IN EVERY BITE
            </motion.h1>

            <div className="flex flex-wrap justify-center gap-8 px-4">

                <motion.div
                    className="w-full flex justify-center"
                    whileInView={{ x: 0, opacity: 1 }}
                    initial={{ x: 100, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex justify-center">
                        <p className="my-2 max-w-xl py-6 text-center text-xl">
                            Your trusted tool for understanding food ingredients and ensuring every meal is safe, nutritious, and healthy for you and your loved ones. Make informed choices with confidence.
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    className="w-full flex justify-center"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <button
                        className="px-6 py-3 bg-purple-400 text-white font-semibold rounded-lg shadow-md hover:bg-purple-500 transition-all"
                        onClick={() => { navigate('/login') }}
                    >
                        Let's Uncover What's Inside
                    </button>
                </motion.div>

                <div className="w-full flex justify-between gap-8 px-4">
                    <motion.div
                        className="w-full lg:w-1/2 lg:p-8"
                        whileInView={{ opacity: 1, x: 0 }}
                        initial={{ x: -100, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex items-center justify-center">
                            <img
                                className="rounded-2xl w-full h-auto object-cover"
                                src={img1}
                                alt="about"
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        className="w-full lg:w-1/2 lg:p-8"
                        whileInView={{ opacity: 1, x: 0 }}
                        initial={{ x: 100, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex items-center justify-center">
                            <img
                                className="rounded-2xl w-full h-auto object-cover"
                                src={img2}
                                alt="about"
                            />
                        </div>
                    </motion.div>
                </div>

            </div>
        </div>


    );
}
export default Home;