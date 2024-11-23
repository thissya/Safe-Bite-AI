import { motion } from "framer-motion";

function About() {
    return (
        <div className="flex-row text-center pb-8 border-b border-neutral-900">
            <motion.h1
                whileInView={{ y: 0, opacity: 1 }}
                initial={{ y: -100, opacity: 0 }}
                transition={{ duration: 1 }}
                className="my-20 text-center text-purple-400 text-5xl font-serif"
            >
                About
            </motion.h1>

            <motion.div
                className="w-full flex justify-center"
                whileInView={{ x: 0, opacity: 1 }}
                initial={{ x: 100, opacity: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="max-w-4xl px-4 py-6 text-center text-xl">
                    <p className="my-2">
                        At Ingredient Food Safety Checker, our mission is to empower individuals to make healthier, more informed food choices. We understand the importance of knowing exactly what goes into your meals and how it impacts your health. With the power of advanced technology, our tool scans ingredients from food packaging and identifies potential risks, allergens, or harmful substances that may be hidden in your food.
                        Whether you're managing a specific health condition, looking to avoid certain ingredients, or simply being proactive about your wellness, our platform offers easy-to-understand insights that allow you to take control of what you eat. With real-time scanning, detailed ingredient analysis, and personalized safety recommendations, we bring food safety to your fingertips.
                        Our goal is to make food safety accessible to everyone – so you can enjoy every meal with confidence. We believe that what you eat should nourish and protect you, not harm you.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default About;
