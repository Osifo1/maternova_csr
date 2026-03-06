import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { VoiceControls } from '@/components/VoiceControls';
import { AlertTriangle, CheckCircle, Info, Upload, Send, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import heroImage from '@/assets/symptom-checker-hero.jpg';

// Medical information database with English and Pidgin translations
const medicalInfo = {
  impetigo: {
    english: {
      conditionName: "This is Impetigo (skin infection)",
      symptoms: "• Red sores that burst open\n• Honey-colored crusts\n• Itchy rash that spreads easily\n• Fluid-filled blisters",
      causes: "• Bacterial infection (Staphylococcus)\n• Spread through skin contact\n• Poor hygiene\n• Enters through cuts or insect bites",
      treatment: "• Apply antibiotic cream\n• Keep affected area clean and dry\n• Oral antibiotics for severe cases\n• Avoid scratching to prevent spread",
      advice: "Highly contagious. Wash hands frequently. Don't share towels. Keep children home until treatment starts. Cover sores until healed."
    },
    pidgin: {
      conditionName: "Na Impetigo (skin infection) be dis",
      symptoms: "• Red-red sore wey dey burst\n• Yellow crust like honey\n• E dey itch and spread quick-quick\n• Water wey dey inside sore",
      causes: "• Small-small germ (bacteria) wey dey cause am\n• E dey spread when you touch person\n• When person no dey wash body well\n• E dey enter through cut or where insect bite",
      treatment: "• Put antibiotic cream for the place\n• Wash the place clean and make e dry\n• If e bad well, doctor go give you medicine to swallow\n• No scratch am make e no spread",
      advice: "E dey spread quick-quick o. Wash hand well-well. No share towel with anybody. If na pikin get am, make e stay house until treatment start. Cover the sore until e heal finish."
    }
  },
  pterygium: {
    english: {
      conditionName: "This is Pterygium (eye growth)",
      symptoms: "• Fleshy growth on the white part of the eye\n• Redness and irritation\n• Feeling like something is in your eye\n• Blurred vision if it covers the pupil",
      causes: "• Too much sun exposure\n• Dust and wind irritation\n• Dry eye conditions\n• Common in tropical climates",
      treatment: "• Use lubricating eye drops\n• Wear UV-protection sunglasses outdoors\n• Surgical removal if vision is affected\n• Keep eyes moist with artificial tears",
      advice: "Get regular eye checkups. Protect your eyes from sun and dust. See a doctor if growth increases or vision changes. Always wear sunglasses when going outside."
    },
    pidgin: {
      conditionName: "Na Pterygium (something wey dey grow for eye) be dis",
      symptoms: "• Something like meat dey grow for the white part of eye\n• Eye dey red and dey pain\n• You go feel like sand dey inside your eye\n• E fit block your eye if e big",
      causes: "• Too much sun for eye\n• Dust and breeze dey worry eye\n• When eye dey dry\n• E dey happen plenty for hot place like our country",
      treatment: "• Put eye drop wey go make eye wet\n• Wear dark glass wey go protect eye from sun\n• If e dey block your eye, doctor go operate am\n• Dey put eye drop when eye dey dry",
      advice: "Make you dey check your eye regular at hospital. Cover your eye from sun and dust. If the thing dey grow big or e dey block your eye, go see doctor quick-quick. Always wear glass when you dey go outside."
    }
  }
};

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState('');
  const [language, setLanguage] = useState<'english' | 'pidgin'>('english');
  const [currentStep, setCurrentStep] = useState<'input' | 'result' | 'detectionResult'>('input');
  const [result, setResult] = useState<{
    type: 'normal' | 'warning' | 'emergency';
    title: string;
    message: string;
    recommendations: string[];
  } | null>(null);
  const [detectionResult, setDetectionResult] = useState<{
    condition: string;
    confidence: number;
    boundingBox: any;
    imageUrl?: string;
  } | null>(null);
  const { toast } = useToast();

  const analyzeSymptoms = () => {
    if (!symptoms.trim()) {
      toast({
        title: "Please describe your symptoms",
        description: "Enter your symptoms to get personalized guidance.",
        variant: "destructive"
      });
      return;
    }

    // Simple rule-based analysis (in real app, this would use ML/AI)
    const symptomText = symptoms.toLowerCase();
    
    let analysisResult;
    
    if (symptomText.includes('bleeding') || symptomText.includes('severe pain') || 
        symptomText.includes('cant breathe') || symptomText.includes('chest pain')) {
      analysisResult = {
        type: 'emergency' as const,
        title: 'Seek Immediate Medical Attention',
        message: 'The symptoms you described may require urgent medical care. Please contact your healthcare provider immediately or visit the nearest emergency room.',
        recommendations: [
          'Call your doctor immediately',
          'Go to the nearest emergency room',
          'Do not wait for symptoms to worsen',
          'Have someone drive you or call emergency services'
        ]
      };
    } else if (symptomText.includes('nausea') || symptomText.includes('tired') || 
               symptomText.includes('back pain') || symptomText.includes('heartburn')) {
      analysisResult = {
        type: 'normal' as const,
        title: 'Common Pregnancy Symptoms',
        message: 'These appear to be normal pregnancy-related symptoms. Here are some safe remedies and when to contact your doctor.',
        recommendations: [
          'Rest and stay hydrated',
          'Eat small, frequent meals',
          'Use a pregnancy pillow for back support',
          'Contact your doctor if symptoms worsen'
        ]
      };
    } else {
      analysisResult = {
        type: 'warning' as const,
        title: 'Monitor and Consult Your Doctor',
        message: 'While these symptoms may not be immediately concerning, it\'s best to discuss them with your healthcare provider.',
        recommendations: [
          'Schedule an appointment with your doctor',
          'Keep track of when symptoms occur',
          'Note any triggers or patterns',
          'Call if symptoms become more severe'
        ]
      };
    }

    setResult(analysisResult);
    setCurrentStep('result');
  };

  const resetChecker = () => {
    setSymptoms('');
    setCurrentStep('input');
    setResult(null);
    setDetectionResult(null);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    toast({
      title: "Analyzing Image",
      description: "Please wait while we analyze your image...",
    });

    try {
      // Create FormData and append the file directly
      const formData = new FormData();
      formData.append('file', file);

      // Send as FormData (not JSON with base64)
      const response = await fetch(
        'https://serverless.roboflow.com/c3-hackaton-lgikz/1?api_key=JhpVj8T0iPdM1jXVd5lb',
        {
          method: 'POST',
          body: formData  // Remove Content-Type header, browser sets it automatically
        }
      );

      console.log("Response status:", response.status);
      
      const apiResult = await response.json();
      console.log('API Response:', apiResult);
      
      if (!response.ok) {
        throw new Error(`API Error ${response.status}: ${apiResult.message || 'Unknown error'}`);
      }
      
      // Create object URL for the image display
      const imageUrl = URL.createObjectURL(file);
      processDetectionResult(apiResult, imageUrl);
      
    } catch (error: any) {
      console.error('API Error:', error);
      toast({
        title: "Analysis Failed",
        description: "Could not analyze image. Please try again.",
        variant: "destructive"
      });
    }
  };
  const processDetectionResult = (apiResult: any, imageUrl: string) => {
    console.log('Processing detection result:', apiResult);
    
    if (apiResult.predictions && apiResult.predictions.length > 0) {
      const detection = apiResult.predictions[0];
      
      // Show ALL predictions regardless of confidence
      setDetectionResult({
        condition: detection.class,
        confidence: detection.confidence,
        boundingBox: detection,
        imageUrl
      });
      setCurrentStep('detectionResult');
      
      // Different toast messages based on confidence level
      if (detection.confidence >= 0.7) {
        toast({
          title: "Analysis Complete",
          description: `Detected: ${detection.class} (${(detection.confidence * 100).toFixed(1)}% confidence)`,
        });
      } else {
        toast({
          title: "Low Confidence Detection",
          description: `Possible ${detection.class} (${(detection.confidence * 100).toFixed(1)}% confidence). Please verify with a doctor.`,
        });
      }
    } else {
      // No detection
      showUnknownCondition();
    }
  };

  const showUnknownCondition = () => {
    toast({
      title: "Unable to Identify",
      description: "Please try a clearer image or consult a healthcare professional.",
      variant: "destructive"
    });
  };

  const speakAdvice = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'pidgin' ? 'en-NG' : 'en-US';
      window.speechSynthesis.speak(utterance);
      toast({
        title: "Speaking",
        description: "Playing audio advice...",
      });
    } else {
      toast({
        title: "Not Supported",
        description: "Text-to-speech is not supported in your browser.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen">
      <div className="w-full h-64 md:h-80 lg:h-96 overflow-hidden">
        <img 
          src={heroImage} 
          alt="Pregnant woman resting comfortably" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-medical-heading flex-1">Symptom Checker</h1>
            <Button 
              variant="outline" 
              onClick={() => setLanguage(language === 'english' ? 'pidgin' : 'english')}
            >
              {language === 'english' ? 'Switch to Pidgin' : 'Switch to English'}
            </Button>
          </div>
          <p className="text-medical-subheading max-w-2xl mx-auto">
            {language === 'english' 
              ? 'Describe your symptoms and get personalized guidance from our AI-powered assessment tool. Always consult your healthcare provider for medical decisions.'
              : 'Tell us wetin you dey feel and we go give you advice. But make sure say you see doctor o, dis one na just to guide you.'
            }
          </p>
        </div>

        {currentStep === 'input' && (
          <Card className="card-medical max-w-2xl mx-auto">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">Describe Your Symptoms</h2>
                <p className="text-muted-foreground mb-4">
                  Please provide as much detail as possible about what you're experiencing.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {language === 'english' ? 'Symptom Description' : 'Tell Us Wetin You Dey Feel'}
                  </label>
                  <Textarea
                    placeholder={language === 'english' 
                      ? "Describe your symptoms in detail... (e.g., 'I've been experiencing morning nausea for the past week, mild back pain, and feeling more tired than usual')"
                      : "Tell us wetin you dey feel... (like say 'I dey vomit for morning, my back dey pain me small, and I dey tire well well')"
                    }
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    className="min-h-[120px] resize-none"
                  />
                  
                  <VoiceControls 
                    text={symptoms}
                    onVoiceInput={(transcript) => setSymptoms(prev => prev + ' ' + transcript)}
                    showSpeechToText={true}
                    showTextToSpeech={false}
                    className="mt-2"
                  />
                </div>

                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground mb-3">
                    {language === 'english' 
                      ? 'Or upload an image (e.g., swollen foot, rash)'
                      : 'Or you fit upload picture (like swollen leg, rash)'
                    }
                  </p>
                  <input 
                    type="file" 
                    id="imageUpload" 
                    accept="image/*" 
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => document.getElementById('imageUpload')?.click()}
                    className="btn-medical-secondary"
                  >
                    {language === 'english' ? 'Upload Image' : 'Upload Picture'}
                  </Button>
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <Button 
                  onClick={analyzeSymptoms}
                  className="btn-medical-accent px-8 py-3 text-lg"
                  disabled={!symptoms.trim()}
                >
                  <Send className="w-5 h-5 mr-2" />
                  {language === 'english' ? 'Analyze Symptoms' : 'Check Symptoms'}
                </Button>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 text-center">
                <p className="text-sm text-muted-foreground">
                  <Info className="w-4 h-4 inline mr-2" />
                  {language === 'english' 
                    ? 'This tool provides general guidance only and is not a substitute for professional medical advice.'
                    : 'Dis tool na just to guide you, e no replace real doctor advice o.'
                  }
                </p>
              </div>
            </div>
          </Card>
        )}

        {currentStep === 'result' && result && (
          <div className="space-y-6">
            <Card className={`p-8 ${
              result.type === 'emergency' ? 'border-destructive bg-destructive/5' :
              result.type === 'warning' ? 'border-warning bg-warning/5' :
              'border-success bg-success/5'
            }`}>
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                  result.type === 'emergency' ? 'bg-destructive/10' :
                  result.type === 'warning' ? 'bg-warning/10' :
                  'bg-success/10'
                }`}>
                  {result.type === 'emergency' && <AlertTriangle className="w-6 h-6 text-destructive" />}
                  {result.type === 'warning' && <Info className="w-6 h-6 text-warning" />}
                  {result.type === 'normal' && <CheckCircle className="w-6 h-6 text-success" />}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-foreground mb-3">{result.title}</h2>
                  <p className="text-medical-body mb-6">{result.message}</p>
                  
                  <VoiceControls 
                    text={`${result.title}. ${result.message}. ${result.recommendations.join('. ')}`}
                    showSpeechToText={false}
                    showTextToSpeech={true}
                    className="mb-4"
                  />
                  
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">Recommended Actions:</h3>
                    <ul className="space-y-2">
                      {result.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-muted-foreground">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Card>

            <div className="text-center">
              <Button 
                onClick={resetChecker}
                variant="outline"
                className="mr-4"
              >
                {language === 'english' ? 'Check New Symptoms' : 'Check Another Thing'}
              </Button>
              <Button 
                className="btn-medical-accent"
              >
                {language === 'english' ? 'Save to History' : 'Save Am'}
              </Button>
            </div>

            <Card className="card-medical">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  {language === 'english' ? 'Need More Help?' : 'You Need More Help?'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {language === 'english' 
                    ? 'Connect with our community or consult with verified healthcare professionals.'
                    : 'Talk to people for community or see real doctor.'
                  }
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button variant="outline">
                    {language === 'english' ? 'Ask Community' : 'Ask People'}
                  </Button>
                  <Button className="btn-medical-primary">
                    {language === 'english' ? 'Find a Doctor' : 'Find Doctor'}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {currentStep === 'detectionResult' && detectionResult && (
          <div className="space-y-6">
            <Card className="p-8 border-primary bg-primary/5">
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold text-foreground mb-2">
                    {language === 'english' ? 'Detection Results' : 'Wetin We See'}
                  </h2>
                  <p className="text-lg text-primary font-medium">
                    {detectionResult.condition.charAt(0).toUpperCase() + detectionResult.condition.slice(1)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {language === 'english' ? 'Confidence' : 'How Sure We Dey'}: {(detectionResult.confidence * 100).toFixed(1)}%
                  </p>
                </div>

                {detectionResult.imageUrl && (
                  <div className="flex justify-center">
                    <div className="relative inline-block">
                      <img 
                        src={detectionResult.imageUrl} 
                        alt="Uploaded for analysis" 
                        className="max-w-full rounded-lg block"
                      />
                      {detectionResult.boundingBox && (
                        <>
                          <div 
                            className="absolute border-4 border-destructive pointer-events-none"
                            style={{
                              left: `${(detectionResult.boundingBox.x - detectionResult.boundingBox.width / 2) / detectionResult.boundingBox.image_width * 100}%`,
                              top: `${(detectionResult.boundingBox.y - detectionResult.boundingBox.height / 2) / detectionResult.boundingBox.image_height * 100}%`,
                              width: `${detectionResult.boundingBox.width / detectionResult.boundingBox.image_width * 100}%`,
                              height: `${detectionResult.boundingBox.height / detectionResult.boundingBox.image_height * 100}%`,
                              backgroundColor: 'rgba(239, 68, 68, 0.1)'
                            }}
                          />
                          <div
                            className="absolute bg-background px-2 py-1 rounded text-xs font-bold text-destructive border-2 border-destructive pointer-events-none"
                            style={{
                              left: `${(detectionResult.boundingBox.x - detectionResult.boundingBox.width / 2) / detectionResult.boundingBox.image_width * 100}%`,
                              top: `${Math.max(0, ((detectionResult.boundingBox.y - detectionResult.boundingBox.height / 2) / detectionResult.boundingBox.image_height * 100) - 7)}%`,
                            }}
                          >
                            {language === 'english' ? 'Detected Area' : 'Where We See Am'}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {medicalInfo[detectionResult.condition.toLowerCase() as keyof typeof medicalInfo] && (
                  <div className="space-y-4">
                    <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                      <h3 className="font-bold text-foreground text-lg mb-2">
                        {language === 'english' ? 'Condition' : 'Wetin E Be'}
                      </h3>
                      <p className="text-foreground font-medium">
                        {medicalInfo[detectionResult.condition.toLowerCase() as keyof typeof medicalInfo][language].conditionName}
                      </p>
                    </div>

                    <div className="bg-background rounded-lg p-4">
                      <h3 className="font-bold text-foreground text-lg mb-3">
                        {language === 'english' ? 'Symptoms' : 'How E Dey Show'}
                      </h3>
                      <div className="text-muted-foreground whitespace-pre-line leading-relaxed">
                        {medicalInfo[detectionResult.condition.toLowerCase() as keyof typeof medicalInfo][language].symptoms}
                      </div>
                    </div>

                    <div className="bg-background rounded-lg p-4">
                      <h3 className="font-bold text-foreground text-lg mb-3">
                        {language === 'english' ? 'Causes' : 'Wetin Dey Cause Am'}
                      </h3>
                      <div className="text-muted-foreground whitespace-pre-line leading-relaxed">
                        {medicalInfo[detectionResult.condition.toLowerCase() as keyof typeof medicalInfo][language].causes}
                      </div>
                    </div>

                    <div className="bg-background rounded-lg p-4">
                      <h3 className="font-bold text-foreground text-lg mb-3">
                        {language === 'english' ? 'Treatment' : 'How To Treat Am'}
                      </h3>
                      <div className="text-muted-foreground whitespace-pre-line leading-relaxed">
                        {medicalInfo[detectionResult.condition.toLowerCase() as keyof typeof medicalInfo][language].treatment}
                      </div>
                    </div>

                    <div className="bg-accent/10 rounded-lg p-4 border border-accent/20">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-bold text-foreground text-lg mb-3">
                            {language === 'english' ? 'Important Advice' : 'Important Advice'}
                          </h3>
                          <p className="text-foreground font-medium leading-relaxed">
                            {medicalInfo[detectionResult.condition.toLowerCase() as keyof typeof medicalInfo][language].advice}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            const info = medicalInfo[detectionResult.condition.toLowerCase() as keyof typeof medicalInfo][language];
                            const fullText = `${info.conditionName}. Symptoms: ${info.symptoms}. Causes: ${info.causes}. Treatment: ${info.treatment}. Important Advice: ${info.advice}`;
                            speakAdvice(fullText);
                          }}
                          className="ml-4 flex-shrink-0"
                          title={language === 'english' ? 'Listen to full advice' : 'Hear all the advice'}
                        >
                          <Volume2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            <div className="text-center">
              <Button 
                onClick={resetChecker}
                variant="outline"
                className="mr-4"
              >
                {language === 'english' ? 'Check New Symptoms' : 'Check Another Thing'}
              </Button>
            </div>

            <Card className="card-medical">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  {language === 'english' ? 'Need More Help?' : 'You Need More Help?'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {language === 'english' 
                    ? 'Connect with our community or consult with verified healthcare professionals.'
                    : 'Talk to people for community or see real doctor.'
                  }
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button variant="outline">
                    {language === 'english' ? 'Ask Community' : 'Ask People'}
                  </Button>
                  <Button className="btn-medical-primary">
                    {language === 'english' ? 'Find a Doctor' : 'Find Doctor'}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default SymptomChecker;