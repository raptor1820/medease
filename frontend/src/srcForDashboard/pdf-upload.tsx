import type { SetStateAction } from 'react'
import { useEffect, useState } from 'react'
// import { useRouter } from 'next/navigation'
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import { Progress } from "./components/ui/progress"
import { ScrollArea } from "./components/ui/scroll-area"
import { Upload, FileText, Check, File, Search } from "lucide-react"
import { User } from "lucide-react"

const templates = [
  { id: 'chest-pain', name: 'Chest Pain' },
  { id: 'abdominal-pain', name: 'Abdominal Pain' },
  { id: 'headache', name: 'Headache' },
]

export default function PDFUploadWithTemplates() {
  // const router = useRouter()

  // useEffect(() => {
  //   if (!router) return;
  // }, [router]);

  const [file, setFile] = useState<File | null>(null)
  const [converting, setConverting] = useState(false)
  const [conversionProgress, setConversionProgress] = useState(0)
  const [converted, setConverted] = useState(false)
  const [selectedPreviousFile, setSelectedPreviousFile] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPatient, setCurrentPatient] = useState<string | null>(null)
  const [pdfNamesForPatient, setPdfNamesForPatient] = useState<string[]>([])
  const [bodyData, setBodyData] = useState<string | null>(null)
  const patientNames = ["john doe", "bob junior", "mira amir", "hunlee li", "sanvi jain", "james bond"].sort()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    setFile(files[0])
    if (files && files[0] && files[0].type === "application/pdf") {
      setFile(files[0])
      setSelectedPreviousFile(null)
    } else {
      alert("Please select a valid PDF file.")
    }
  }

  const resetInput = () => {
    const input = document.getElementById("TTTR") as HTMLInputElement
    const temp = input.value;
    if (input)
      input.value = ""
    input.value = temp;
  }

  const handlePreviousFileSelect = (fileName: string) => {
    setSelectedPreviousFile(fileName)
    setFile(null)
    resetInput()
  }

  const handleUpload = async () => {
    if (!file && !selectedPreviousFile) return
  
    setConverting(true)
    setConversionProgress(0)
  
    try {
      if (file) {
        const formData = new FormData();
        formData.append('name', currentPatient);
        formData.append('file', file);
        const response = await fetch('http://localhost:5000/uploadpdf', {
          method: 'POST',
          body: formData,
        });
        fetchPatientFiles();
    
        const msg = await response.json();
        console.log(msg.message);
      }

      await new Promise(resolve => setTimeout(resolve, 5000));

      // Send for getPDF function
      const url = new URL('http://localhost:5000/getpdf');
      url.searchParams.append('name', currentPatient);
      if (file) {
        url.searchParams.append('pdfName', file.name)
      } else {
        url.searchParams.append('pdfName', selectedPreviousFile)
      }
      const response = await fetch(url.toString());
      if (response.ok) {
        const data = await response.json();
        const output = data.bodytext.replace(/(?:\r\n|\r|\n)/g, '<br>');
        console.log(output);
        setBodyData(output);
      } else {
        console.error('Failed to fetch PDF Data:', response.statusText);
        setBodyData("Failed to convert pdf");
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setConverting(false)
      setConverted(true)
    }
  }

  const handlePatientChange = async (patientName: string) => {
    setCurrentPatient(patientName)

    // fetch files for the patient
    fetchPatientFiles();
  }

  const fetchPatientFiles = async () => {
    try {
      const response = await fetch(`http://localhost:5000/getpdfs?name=${currentPatient}`);
      const data = await response.json();
      setPdfNamesForPatient([]);
      if (response.ok) {
        setPdfNamesForPatient(data.pdfs);
      } else {
        console.error('Failed to fetch PDFs:', data.message);
      }
    } catch (error) {
      console.error('Error fetching PDFs:', error);
    }
  }

  const handleSearchChange = (event: { target: { value: SetStateAction<string> } }) => {
    setSearchQuery(event.target.value)
  }

  const downloadPDF = async () => {
    const link = document.createElement('a');
    link.href = `http://localhost:5000/downloadpdf`;
    link.download = `${currentPatient}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const filteredNames = patientNames.filter(patientN => 
    patientN.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredFileNames = pdfNamesForPatient.filter(pdfName =>
    pdfName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-white p-6 shadow-md flex flex-col">
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search patients..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-8"
            />
          </div>
        </div>
        <h2 className="text-xl font-semibold mb-4">Patients</h2>
        <ScrollArea className="flex-grow">
          {filteredNames.map((patientName) => (
            <Button
              key={patientName}
              // variant="ghost"
              className={`w-full justify-start mb-2 ${selectedPreviousFile === patientName ? 'bg-primary/10' : ''}`}
              onClick={() => handlePatientChange(patientName)}
            >
              <User className="mr-2 h-4 w-4" />
              {patientName}
            </Button>
          ))}
        </ScrollArea>
      </div>

      {currentPatient && (<div className="w-64 bg-white p-6 shadow-md flex flex-col">
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search patient's documents..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-8"
            />
          </div>
        </div>
        <h2 className="text-xl font-semibold mb-4">{currentPatient}</h2>
        <ScrollArea className="flex-grow">
          {filteredFileNames.map((fileName) => (
            <Button
              key={fileName}
              // variant="ghost"
              className={`w-full justify-start mb-2 ${selectedPreviousFile === fileName ? 'bg-primary/10' : ''}`}
              onClick={() => handlePreviousFileSelect(fileName)}
            >
              <File className="mr-2 h-4 w-4" />
              {fileName}
            </Button>
          ))}
        </ScrollArea>
      </div>)}

      <div className="flex-1 p-6 overflow-auto">
        <h1 className="text-2xl font-bold mb-4">Upload PDF to Selected Patient</h1>
        
        {(
          <div className="space-y-4">
            <Input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
              id="TTTR"
            />
            <Button onClick={handleUpload} disabled={(!file && !selectedPreviousFile) || !currentPatient || converting}>
              {converting ? "Converting..." : `Upload and Convert ${selectedPreviousFile || ''}`}
              {!converting && <Upload className="ml-2 h-4 w-4" />}
            </Button>
            
            {converted && (
              <Button onClick={downloadPDF}>
                Download generated PDF: {currentPatient}.pdf
              </Button>
            )}
          </div>
        )}

        {converting && (
          <div className="space-y-2">
            <Progress value={conversionProgress} className="w-full" />
            <p className="text-sm text-gray-500">Converting PDF to text...</p>
          </div>
        )}

        {converted && (
          <div className="space-y-4">
          <div className="flex items-center space-x-2 text-green-600"> 
            {/* Added margin-top to lower the text */}
            <br /> {/* New line added */}
            <FileText className="h-5 w-5" />
            <span>PDF converted successfully!</span>
            <Check className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Differential Diagnosis: </h2>
          <div className="space-y-50 text-lg leading-loose" dangerouslySetInnerHTML={{ __html: bodyData || '' }}></div>
        </div>        
        )}
      </div>
    </div>
  )
}
