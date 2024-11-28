import { motion } from "framer-motion";

import abt1 from "../assets/aboutimg1.jpg";
import abt2 from "../assets/foodlabels02.jpg";

function About() {
    return (
        <div className="flex-row text-center pb-8 border-b border-neutral-900">
            <motion.h1
                whileInView={{ x: 0, opacity: 1 }}
                initial={{ x: -100, opacity: 0 }}
                transition={{ duration: 1 }}
                className="my-20 text-center text-purple-400 text-5xl font-serif"
            >
                About Us
            </motion.h1>

            <motion.div
                className="w-full flex justify-center"
                whileInView={{ y: -50, opacity: 1 }}
                initial={{ y: 50, opacity: 0 }}
                transition={{ duration: 1 }}
            >
                <div className="max-w-4xl px-4 py-6 text-center text-xl">
                    <p className="my-2">
                        At <span className="font-bold">Ingredient Food Safety Checker</span>, our mission is to empower individuals
                        to make healthier, more informed food choices. We understand the importance of knowing exactly what goes into
                        your meals and how it impacts your health.
                    </p>
                    <p className="my-4">
                        Our platform scans ingredients from food packaging and provides detailed insights into potential risks, allergens,
                        or harmful substances that may be hidden in your food. Whether you're managing a specific health condition, avoiding
                        certain ingredients, or proactively safeguarding your wellness, our tool delivers <span className="font-bold">real-time scanning</span>,
                        personalized safety recommendations, and easy-to-understand ingredient analysis tailored to your needs.
                    </p>
                    
                    <p className="mt-6">
                        Our goal is to make food safety accessible to everyone – so you can enjoy every meal with confidence.
                        We believe that what you eat should nourish and protect you, helping you lead a healthier, more informed lifestyle.
                    </p>
                </div>
            </motion.div>


            <div className="w-full flex justify-between gap-8 px-4">
                <motion.div
                    className="w-full lg:w-1/2 lg:p-8"
                    whileInView={{ opacity: 1, x: 0 }}
                    initial={{ x: -100, opacity: 0 }}
                    transition={{ duration: 1 }}
                >
                    <div className="flex items-center justify-center">
                        <img
                            className="rounded-2xl w-full h-auto object-cover"
                            src={abt1}
                            alt="about"
                        />
                    </div>
                </motion.div>

                <motion.div
                    className="w-full lg:w-1/2 lg:p-8"
                    whileInView={{ opacity: 1, x: 0 }}
                    initial={{ x: 100, opacity: 0 }}
                    transition={{ duration: 1 }}
                >
                    <div className="flex items-center justify-center">
                        <img
                            className="rounded-2xl w-full h-auto object-cover"
                            src={abt2}
                            alt="about"
                        />
                    </div>
                </motion.div>
            </div>

            <motion.h1
                whileInView={{ x: 0, opacity: 1 }}
                initial={{ x: -100, opacity: 0 }}
                transition={{ duration: 1 }}
                className="my-10 text-center text-purple-400 text-3xl font-serif"
            >
                Better Understanding
            </motion.h1>

            <motion.div
                className="w-full flex justify-center"
                whileInView={{ x: 0, opacity: 1 }}
                initial={{ x: 100, opacity: 0 }}
                transition={{ duration: 1 }}
            >
                <div className="max-w-4xl px-4 py-3 text-center text-xl">
                    <p className="my-2">
                        We analyze and assess the ingrdients in you food products to help you understand their impact on your health, alergies and dietry goals. Gain insights based on your medical conditions and preferences.
                    </p>
                </div>
            </motion.div>

            <motion.h1
                whileInView={{ x: 0, opacity: 1 }}
                initial={{ x: -100, opacity: 0 }}
                transition={{ duration: 1 }}
                className="my-10 text-center text-purple-400 text-3xl font-serif"
            >
                Personalized Recommendations
            </motion.h1>

            <motion.div
                className="w-full flex justify-center"
                whileInView={{ x: 0, opacity: 1 }}
                initial={{ x: 100, opacity: 0 }}
                transition={{ duration: 1 }}
            >
                <div className="max-w-4xl px-4 py-3 text-center text-xl">
                    <p className="my-2">
                        We provide tailored suggestions based on the ingredients found in your food items. Get recommendations on healthier alternatives and make informed choices for your diet.
                    </p>
                </div>
            </motion.div>

            <motion.h1
                whileInView={{ x: 0, opacity: 1 }}
                initial={{ x: -100, opacity: 0 }}
                transition={{ duration: 1 }}
                className="my-10 text-center text-purple-400 text-3xl font-serif"
            >
                Track Your Progress
            </motion.h1>

            <motion.div
                className="w-full flex justify-center "
                whileInView={{ x: 0, opacity: 1 }}
                initial={{ x: 100, opacity: 0 }}
                transition={{ duration: 1 }}
            >
                <div className="max-w-4xl px-4 py-3 text-center text-xl">
                    <p className="my-2">Keep track of your health journey by regularly scanning food labels and monitoring your improvements. Receive follow-ups and updated insights as you continue your wellness path.
                    </p>
                </div>
            </motion.div>

        </div>
    );
};

export default About;