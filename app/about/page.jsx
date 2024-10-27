import React, { useState } from 'react';
import Image from 'next/image';
import { AiOutlineDown, AiOutlineUp } from 'react-icons/ai'; // Importing icons from react-icons

const AboutMePage = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqs = [
    { question: "🤔 What services do you offer?", answer: "We offer a variety of health services including general check-ups, consultations, and specialist referrals. 🩺" },
    { question: "📅 How can I book an appointment?", answer: "You can book an appointment online through our website or call our office directly. 📞" },
    { question: "⏰ What are your office hours?", answer: "We are open Monday to Friday from 9 AM to 5 PM. 🌞" },
    { question: "🏥 Do you accept insurance?", answer: "Yes, we accept various insurance plans. Please check with our office for details. 💳" },
    { question: "📞 Can I get a prescription refill?", answer: "Yes, you can request a prescription refill during your next visit or contact us directly. 💊" },
    { question: "🧑‍⚕️ How do I get my lab results?", answer: "Lab results can be accessed through our patient portal or by contacting our office. 📊" },
  ];

  const services = [
    { id: 1, title: "Consultation", icon: "🩺" },
    { id: 2, title: "Emergency Care", icon: "🚑" },
    { id: 3, title: "Therapy", icon: "💊" },
    { id: 4, title: "Pediatrics", icon: "👶" },
  ];

  return (
    <div className="p-4 md:p-8 mt-20">
      {/* About Us Section */}
      <div className="flex flex-col md:flex-row items-center mb-12">
        <div className="flex-1 mb-4 md:mb-0">
          <Image
            src="/images/dc.png" // Update with your image path
            alt="About Us"
            width={500}
            height={400}
            className="object-cover rounded-lg"
          />
        </div>
        <div className="flex-1 ml-0 md:ml-4">
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-500 to-green-500 text-transparent bg-clip-text mb-4">
            About Us
          </h2>
          <p className="text-gray-700 mb-4 text-justify">
            Welcome to Prescripto, your trusted partner in managing your healthcare needs conveniently and efficiently. At Prescripto, we understand the challenges individuals face when it comes to scheduling doctor appointments and managing their health records.
          </p>
          <p className="text-gray-600 mb-4 text-justify">
            Prescripto is committed to excellence in healthcare technology. We continuously strive to enhance our platform, integrating the latest advancements to improve user experience and deliver superior service. Whether you're booking your first appointment or managing ongoing care, Prescripto is here to support you every step of the way.
          </p>
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-500 to-green-500 text-transparent bg-clip-text mb-4">
            Our Vision  
          </h2>
          <p className="text-gray-600 text-justify">
            Our vision at Prescripto is to create a seamless healthcare experience for every user. We aim to bridge the gap between patients and healthcare providers, making it easier for you to access the care you need, when you need it.
          </p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent mb-5">
          Frequently Asked Questions        
        </h1>         
        <div className="flex flex-col md:flex-row gap-10 items-center mb-6">
          <div className="flex-1 ml-0 md:ml-4">
            <div className="space-y-2">
              {faqs.map((faq, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <button
                    className="w-full p-4 text-left focus:outline-none flex items-center justify-between"
                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  >
                    <h4 className="font-semibold">{faq.question}</h4>
                    {openFAQ === index ? (
                      <AiOutlineUp className="h-5 w-5 text-gray-700" />
                    ) : (
                      <AiOutlineDown className="h-5 w-5 text-gray-700" />
                    )}
                  </button>
                  {openFAQ === index && (
                    <div className="p-4">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 mb-4 md:mb-0">
            <Image
              src="/assets/assets_frontend/about_image.png" // Update with your FAQ image path
              alt="FAQ"
              width={400}
              height={300}
              className="object-cover rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div>
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent mb-5">
          What we offer
        </h1> 
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {services.map(service => (
            <div key={service.id} className="border rounded-lg p-4 flex flex-col items-center text-center">
              <div className="text-4xl mb-2">{service.icon}</div>
              <h3 className="font-semibold">{service.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutMePage;
