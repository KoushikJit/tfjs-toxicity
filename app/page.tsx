"use client"
import Image from 'next/image'
import Head from 'next/head';
import { useEffect, useRef, useState, KeyboardEvent } from 'react';
import '@tensorflow/tfjs';
import * as toxicity from '@tensorflow-models/toxicity';
import { ToxicityClassifier } from '@tensorflow-models/toxicity';

const threshold = 0.9;
export default function Home() {
  // state 
  const [model, setModel] = useState<ToxicityClassifier>()
  const [answers, setAnswers] = useState<[]>([])

  const loadModel = async () => {
    const loadedModel = await toxicity.load(threshold, ["identity_attack", "insult", "toxicity"]);
    setModel((prevModel) => loadedModel);
    console.log("model loaded!")
  }

  useEffect(() => {
    loadModel();
  }, [])


  //use ref 
  const questionRef = useRef<HTMLInputElement>(null);

  return (
    renderPage()
  )

  //handler function 
  async function onInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    const question = questionRef.current?.value as string;
    // console.log(event.code);
    if(event.code === 'Enter' && model !== undefined){
      console.log(question);
      const res = await model.classify(question)
      console.log(res);
      setAnswers(res as []);
    }  
  }


  // function render page
  function renderPage() {
    return <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Head>
        <title>Minimalist Landing Page</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-4xl font-bold mb-6 text-gray-950">Tensor</h1>
        <div className="max-w-md w-full">
          <input
            ref={questionRef}
            onKeyDown={onInputKeyDown}
            type="text"
            placeholder="Search..."
            className="w-full text-gray-950 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-indigo-500" />
        </div>
        <div className="mt-8">
          <p className="text-lg text-gray-700">
          </p>
        </div>
        { answers && <ProbabilityResults data={answers} />}
      </main>

      <footer className="w-full h-20 flex justify-center items-center bg-gray-200">
        <p className="text-gray-600">© 2023 Your Company</p>
      </footer>
    </div>;
  }
}


const ProbabilityResults = ({ data }: any) => {
  return (
    <div className='flex flex-col gap-8'>
      {data.map((item: any, index: number) => (
        <div key={index}>
          <h3 className='text-gray-950 text-start font-extrabold'>{item.label}</h3>
          <pre className='text-gray-950'>
            Probability 0: {item.results[0].probabilities['0']} | Probability 1:{' '}
            {item.results[0].probabilities['1']}
          </pre>
        </div>
      ))}
    </div>
  );
};