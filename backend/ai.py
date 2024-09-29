from openai import OpenAI
from dotenv import load_dotenv
import os
load_dotenv()

openai = OpenAI(
    api_key=os.getenv("AI_API_KEY"),
)


context =[{
    "role":"user",
    "content":"I am a doctor. You are my assistant. I will give you some background information about a patient. You have to tell me whatever I ask you about. Please answer me in the exact format I tell you. A faliure to do so may cause harm to the patient."
}]

def get_disease_suggestions(pdfDetails):

    context.append({
        "role":"user",
        "content": pdfDetails + "\nGive a some possible one line disease diagnoses based on this information. Please answer me in the exact format I tell you. A faliure to do so may cause harm to the patient. Give me the possible diseases as a comma separated list of conditions. Add other as the last option. Please add no fullstops at the end. "
    })
    response = openai.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=context
    )

    context.append({"role":"assistant", "content":response.choices[0].message.content})
    return response.choices[0].message.content

def get_treatment_suggestions(doctorsDiagnosis):
    context.append({
        "role":"user",
        "content": "Using my expertise as a trained doctor, I conclude that the patient has " + doctorsDiagnosis + "Please answer me in the exact format I tell you. A faliure to do so may cause harm to the patient. Give a list of possible medicines and their doages as a comma separated array of json objects in the format [{name:medicine_name, dose:medicine_dose}, {name:medicine_name, dose:medicine_dose}]. Please add no fullstops at the end."})
    
    response = openai.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=context
    )

    context.append({"role":"assistant", "content":response.choices[0].message.content})
    return response.choices[0].message.content

def get_plan(inHospital):

    if inHospital:
        context.append({
            "role":"user",
            "content":"The patient is in the hospital. I need a plan of action for the nurses to take care of the patient. Please answer me in the exact format I tell you. A faliure to do so may cause harm to the patient. Give a list of actions to be taken as a comma separated list of daily tasks and things that the nurses should take care of. Please add no fullstops at the end."
        })
    else: 
        context.append({
            "role":"user",
            "content":"The patient is at home. I need a plan of action for the patient to take care of themselves along with some precautions to take care of themselves as a comma separated list. Please answer me in the exact format I tell you. Please make sure its only a comma separated list. A faliure to do so may cause harm to the patient. Please add no fullstops at the end."
        })

    response = openai.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=context
    )

    context.append({"role":"assistant", "content":response.choices[0].message.content})
    return response.choices[0].message.content


