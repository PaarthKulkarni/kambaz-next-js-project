
"use client";
import { useParams } from "next/navigation";
import React from 'react';
import { Nav, Row, Col, Button, Form,FormGroup,FormLabel,FormControl,FormSelect,FormCheck }from 'react-bootstrap';
import * as db from "../../../../../Database";
import {FaTimes, FaPlus, FaTrash} from 'react-icons/fa';
import Link from "next/link";
import { RootState } from "../../../../../store";
import { updateQuiz, addQuiz } from "../../reducer";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { useRouter } from "next/navigation";
import * as client from "../../../../client";
import { time } from "console";
import { title } from "process";
import { text } from "stream/consumers";

export default function QuizEditor() {
    const { cid, qid } = useParams();
    const dispatch = useDispatch();
    const router = useRouter();
    const isNew = qid === "new";
    const { currentUser } = useSelector(
        (state: RootState) => state.accountReducer
    );
    const isFaculty = currentUser?.role === "FACULTY";

    const [activeTab, setActiveTab] = useState("details");

    const existingquiz = useSelector((state: RootState) =>
        state.quizzesReducer.quizzes.find((q: any) => qid === q._id));
    const [quiz, setQuiz] = useState<any>(isNew ? {
        _id: "0",
        title: "",
        course: cid,
        points: 100,
        timeLimit: 20,
        quizType: "GRADED_QUIZ",
        availDate: "2025-12-12",
        availTime: "00:00",
        dueDate: "2025-12-13",
        dueTime: "23:59",
        description: "",
        assignmentGroup: "QUIZZES",
        published: false,
        shuffleAnswers: true,
        multipleAttempts: false,
        howManyAttempts: 1,
        showCorrectAnswers: "IMMEDIATELY",
        accessCode: "",
        oneQuestionAtTime: true,
        webcamRequired: false,
        lockQuestionsAfterAnswering: false,
        questions: []
    } : existingquiz);
    const calculatedPoints = React.useMemo(() => {
        return quiz.questions.reduce((sum: number, q: any) => sum + (parseInt(q.points) || 0), 0);
    }, [quiz.questions]);

    React.useEffect(() => {
        setQuiz((prev: any) => ({ ...prev, points: calculatedPoints }));
    }, [calculatedPoints]);
    if (!isNew && !quiz) {
        return <div className="text-danger">Quiz with ID **{qid}** not found in the database.</div>;
    }

    const handleSave = async (Publish = false) => {
        // Validate questions before saving
        for (let i = 0; i < quiz.questions.length; i++) {
            const question = quiz.questions[i];

            // Check if question text is empty
            if (!question.question.trim()) {
                alert(`Question ${i + 1}: Please enter question text`);
                return;
            }

            // Validate Single Choice and Multiple Choice questions
            if (question.type === "SINGLE_CHOICE" || question.type === "MULTIPLE_CHOICE") {
                if (!question.choices || question.choices.length < 2) {
                    alert(`Question ${i + 1}: Must have at least 2 choices`);
                    return;
                }

                const emptyChoice = question.choices.find((choice: any) => !choice.text.trim());
                if (emptyChoice) {
                    alert(`Question ${i + 1}: All choices must have text`);
                    return;
                }

                const correctAnswers = question.choices.filter((choice: any) => choice.isCorrect);

                if (correctAnswers.length === 0) {
                    alert(`Question ${i + 1}: Please mark at least one choice as correct`);
                    return;
                }

                if (question.type === "SINGLE_CHOICE" && correctAnswers.length > 1) {
                    alert(`Question ${i + 1}: Single choice questions can only have one correct answer`);
                    return;
                }
            }

            // Validate Fill in the Blank questions
            if (question.type === "FILL_IN_BLANK") {
                if (!question.possibleAnswers || question.possibleAnswers.length === 0 ||
                    question.possibleAnswers.every((ans: string) => !ans.trim())) {
                    alert(`Question ${i + 1}: Fill in the blank questions must have at least one correct answer`);
                    return;
                }
            }
        }
        const quizToSave = {
            ...quiz,
            points: calculatedPoints,
            published: Publish ? true : quiz.published
        };
        if (isNew) {
            const { _id, ...quizWithoutId } = quizToSave;
            const newQuiz = await client.createQuizForCourse(cid as string, quizWithoutId);
            dispatch(addQuiz(newQuiz));
        }
        else {
            await client.updateQuiz(quizToSave);
            dispatch(updateQuiz(quizToSave));
        }
        router.push(`/Courses/${cid}/Quizzes`);
    }

    const addQuestion = () => {
        const newQuestion = {
            _id: Date.now().toString(),
            type: "SINGLE_CHOICE",
            title: `Question ${quiz.questions.length + 1}`,
            points: 10,
            question: "",
            choices: [],
            correctAnswer: false,
            possibleAnswers: [],
        }
        setQuiz({
            ...quiz,
            questions: [...quiz.questions, newQuestion],
        });
    }

    const removeQuestion = (questionIndex: number) => {
        const updatedQuestions = quiz.questions.filter((_:any, i: number) => i !== questionIndex);
        setQuiz({ ...quiz, questions: updatedQuestions });
    }

    const handleQuestionChange = (index: number, field: string, value: any) => {
        const updatedQuestions = [...quiz.questions];
        updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };

        // Initialize blanks array when switching to FILL_IN_BLANK
        if (field === "type" && value === "FILL_IN_BLANK" && !updatedQuestions[index].blanks) {
            updatedQuestions[index].blanks = [];
        }

        setQuiz({ ...quiz, questions: updatedQuestions });
    }

    const addChoice = (questionIndex: number) => {
        const updatedQuestions = [...quiz.questions];
        updatedQuestions[questionIndex].choices.push({ text: "", isCorrect: false });
        setQuiz({
            ...quiz,
            questions: updatedQuestions,
        });
    }

    const updateChoice = (questionIndex: number, choiceIndex: number, text: string) => {
        const updatedQuestions = [...quiz.questions];
        updatedQuestions[questionIndex].choices[choiceIndex].text = text;
        setQuiz({
            ...quiz,
            questions: updatedQuestions,
        });
    }

    const setCorrectChoice = (questionIndex: number, choiceIndex: number) => {
        const updatedQuestions = [...quiz.questions];
        const question = updatedQuestions[questionIndex];

        // For single choice, uncheck all others first
        if (question.type === "SINGLE_CHOICE") {
            question.choices.forEach((choice: any) => {
                choice.isCorrect = false;
            });
            question.choices[choiceIndex].isCorrect = true;
        } else {
            // For multiple choice, toggle the selected choice
            question.choices[choiceIndex].isCorrect = !question.choices[choiceIndex].isCorrect;
        }

        setQuiz({ ...quiz, questions: updatedQuestions });
    }

    const removeChoice = (questionIndex: number, choiceIndex: number) => {
        const updatedQuestions = [...quiz.questions];
        updatedQuestions[questionIndex].choices = updatedQuestions[questionIndex].choices.filter((_:any, i: number) => i !== choiceIndex);
        setQuiz({
            ...quiz,
            questions: updatedQuestions,
        });
    }

    // Fill in the Blank - Multiple Blanks functions
    const addBlank = (questionIndex: number) => {
        const updatedQuestions = [...quiz.questions];
        if (!updatedQuestions[questionIndex].blanks) {
            updatedQuestions[questionIndex].blanks = [];
        }
        updatedQuestions[questionIndex].blanks.push({
            id: Date.now().toString(),
            possibleAnswers: []
        });
        setQuiz({ ...quiz, questions: updatedQuestions });
    }

    const removeBlank = (questionIndex: number, blankIndex: number) => {
        const updatedQuestions = [...quiz.questions];
        updatedQuestions[questionIndex].blanks = updatedQuestions[questionIndex].blanks.filter((_: any, i: number) => i !== blankIndex);
        setQuiz({ ...quiz, questions: updatedQuestions });
    }

    const updateBlankAnswers = (questionIndex: number, blankIndex: number, answersString: string) => {
        const updatedQuestions = [...quiz.questions];
        updatedQuestions[questionIndex].blanks[blankIndex].possibleAnswers =
            answersString.split(",").map((ans) => ans.trim()).filter(ans => ans !== "");
        setQuiz({ ...quiz, questions: updatedQuestions });
    }

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setQuiz({
            ...quiz,
            [e.target.id]: e.target.value,
        });
    };
    return (
        <div id="wd-quizzes-editor">
            <Nav variant="tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k || "details")} className="mb-3">
                <Nav.Item>
                    <Nav.Link eventKey="details">Details</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="questions">Questions</Nav.Link>
                </Nav.Item>
            </Nav>
            {activeTab === "details" && (
                <>
                    <FormGroup className="mb-3">
                        <FormLabel htmlFor="title" className="fw-bold">Quiz Name</FormLabel>
                        <FormControl
                            id="title"
                            type="text"
                            value={quiz.title}
                            placeholder="Enter Quiz Name"
                            onChange={handleChange}
                            readOnly = {!isFaculty}
                        />
                    </FormGroup>
                    <FormGroup>
                        <FormControl
                            as="textarea"
                            id="description"
                            rows={5}
                            cols={50}
                            value={quiz.description}
                            placeholder="Description"
                            onChange={handleChange}
                            readOnly = {!isFaculty}
                            className="border"/>
                    </FormGroup>

                    <br />
                    <Form>

                        <FormGroup as={Row} className="align-items-center">
                            <FormLabel column sm="3" className="text-end fw-bold">Quiz Type</FormLabel>
                            <Col>
                                <FormSelect id="quizType" value={quiz.quizType} onChange = {handleChange} disabled = {!isFaculty}>
                                    <option>GRADED_QUIZ</option>
                                    <option>PRACTICE_QUIZ</option>
                                    <option>GRADED_SURVEY</option>
                                    <option>UNGRADED_SURVEY</option>
                                </FormSelect>
                            </Col>
                        </FormGroup>

                        <FormGroup as={Row} className="align-items-center mt-2">
                            <FormLabel column sm="3" className="text-end fw-bold">Points</FormLabel>
                            <Col>
                                <FormControl
                                    id="points"
                                    type="number"
                                    value={calculatedPoints}
                                    readOnly
                                    className="bg-light"
                                />
                                <Form.Text className="text-muted">
                                    Total points calculated from all questions
                                </Form.Text>
                            </Col>
                        </FormGroup>

                        <FormGroup as={Row} className="align-items-center mt-2">
                            <FormLabel column sm="3" className="text-end fw-bold">Assignment Group</FormLabel>
                            <Col>
                                <FormSelect id="assignmentGroup" value={quiz.assignmentGroup} onChange = {handleChange} disabled = {!isFaculty}>
                                    <option>QUIZZES</option>
                                    <option>ASSIGNMENTS</option>
                                    <option>EXAMS</option>
                                    <option>PROJECT</option>
                                </FormSelect>
                            </Col>
                        </FormGroup>

                        <FormGroup as={Row} className="align-items-center">
                            <FormLabel column sm="3" className="text-end fw-bold">Shuffle Answers</FormLabel>
                            <Col>
                                <FormSelect
                                    id="shuffleAnswers"
                                    value={quiz.shuffleAnswers ? "true" : "false"}
                                    onChange={(e) => setQuiz({ ...quiz, shuffleAnswers: e.target.value === "true" })}
                                    disabled={!isFaculty}
                                >
                                    <option value="true">Yes</option>
                                    <option value="false">No</option>
                                </FormSelect>
                            </Col>
                        </FormGroup>

                        <FormGroup as={Row} className="align-items-center mt-2">
                            <FormLabel column sm="3" className="text-end fw-bold">Time Limit (in minutes)</FormLabel>
                            <Col>
                                <FormControl id="timeLimit" type="number" value={quiz.timeLimit} onChange={handleChange} readOnly = {!isFaculty}/>
                            </Col>
                        </FormGroup>

                        <FormGroup as={Row} className="align-items-center">
                            <FormLabel column sm="3" className="text-end fw-bold">Multiple Attempts</FormLabel>
                            <Col>
                                <FormSelect
                                    id="multipleAttempts"
                                    value={quiz.multipleAttempts ? "true" : "false"}
                                    onChange={(e) => setQuiz({ ...quiz, multipleAttempts: e.target.value === "true" })}
                                    disabled={!isFaculty}
                                >
                                    <option value="true">Yes</option>
                                    <option value="false">No</option>
                                </FormSelect>
                            </Col>
                        </FormGroup>

                        {isFaculty && quiz.multipleAttempts && (
                            <FormGroup as={Row} className="align-items-center mt-2">
                                <FormLabel column sm="3" className="text-end fw-bold">Number of Attempts</FormLabel>
                                <Col>
                                    <FormControl id="howManyAttempts" type="number" value={quiz.howManyAttempts} onChange={handleChange} readOnly = {!isFaculty}/>
                                </Col>
                            </FormGroup>
                        )}


                        <FormGroup as={Row} className="align-items-center mt-2">
                            <FormLabel column sm="3" className="text-end fw-bold">Access Code</FormLabel>
                            <Col>
                                <FormControl id="accessCode" type="text" value={quiz.accessCode} onChange={handleChange} readOnly = {!isFaculty}/>
                            </Col>
                        </FormGroup>

                        <FormGroup as={Row} className="align-items-center">
                            <FormLabel column sm="3" className="text-end fw-bold">Show Correct Answers</FormLabel>
                            <Col>
                                <FormSelect id="showCorrectAnswers" value={quiz.showCorrectAnswers} onChange = {handleChange} disabled = {!isFaculty}>
                                    <option>IMMEDIATELY</option>
                                    <option>AFTER QUIZ</option>
                                </FormSelect>
                            </Col>
                        </FormGroup>

                        <FormGroup as={Row} className="align-items-center">
                            <FormLabel column sm="3" className="text-end fw-bold">One Question At A Time</FormLabel>
                            <Col>
                                <FormSelect
                                    id="oneQuestionAtATime"
                                    value={quiz.oneQuestionAtATime ? "true" : "false"}
                                    onChange={(e) => setQuiz({ ...quiz, oneQuestionAtATime: e.target.value === "true" })}
                                    disabled={!isFaculty}
                                >
                                    <option value="true">Yes</option>
                                    <option value="false">No</option>
                                </FormSelect>
                            </Col>
                        </FormGroup>

                        <FormGroup as={Row} className="align-items-center">
                            <FormLabel column sm="3" className="text-end fw-bold">Webcam Required</FormLabel>
                            <Col>
                                <FormSelect
                                    id="webcamRequired"
                                    value={quiz.webcamRequired ? "true" : "false"}
                                    onChange={(e) => setQuiz({ ...quiz, webcamRequired: e.target.value === "true" })}
                                    disabled={!isFaculty}
                                >
                                    <option value="true">Yes</option>
                                    <option value="false">No</option>
                                </FormSelect>
                            </Col>
                        </FormGroup>

                        <FormGroup as={Row} className="align-items-center">
                            <FormLabel column sm="3" className="text-end fw-bold">Lock Questions After Answering</FormLabel>
                            <Col>
                                <FormSelect
                                    id="lockQuestionsAfterAnswering"
                                    value={quiz.lockQuestionsAfterAnswering ? "true" : "false"}
                                    onChange={(e) => setQuiz({ ...quiz, lockQuestionsAfterAnswering: e.target.value === "true" })}
                                    disabled={!isFaculty}
                                >
                                    <option value="true">Yes</option>
                                    <option value="false">No</option>
                                </FormSelect>
                            </Col>
                        </FormGroup>

                        <br/>
                        <FormGroup as={Row}>
                            <FormLabel column sm="3" className="text-end fw-bold">Assign</FormLabel>
                            <Col>
                                <div className="border p-3 rounded">

                                    <Row>
                                        <Col sm={6}>
                                            <FormGroup className="mb-2">
                                                <FormLabel htmlFor="availDate" className="fw-bold">Available from</FormLabel>
                                                <div className="d-flex align-items-center position-relative">
                                                    <FormControl
                                                        type="date"
                                                        id="availDate"
                                                        value={quiz.availDate}
                                                        onChange={handleChange}
                                                        readOnly = {!isFaculty}
                                                    />
                                                </div>
                                            </FormGroup>
                                        </Col>
                                        <Col sm={6}>
                                            <FormGroup className="mb-3">
                                                <FormLabel htmlFor="dueDate" className="fw-bold">Until</FormLabel>
                                                <div className="d-flex align-items-center position-relative">
                                                    <FormControl
                                                        type="date"
                                                        id="dueDate"
                                                        value={quiz.dueDate}
                                                        onChange={handleChange}
                                                        readOnly = {!isFaculty}
                                                    />
                                                </div>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                        </FormGroup>

                    </Form>
                </>)}
            {activeTab === "questions" && (
                <div>
                    Questions
                    <div className="d-flex justify-content-center mb-4">
                        <Button variant="secondary" onClick={addQuestion}>
                            <FaPlus className="me-2"/> Add Question
                        </Button>
                    </div>

                    {quiz.questions.map((question: any, qIndex: number) => (
                        <div key={question._id} className="border p-3 mb-4 rounded">

                            <Row className="align-items-center mb-3">
                                <Col sm={3}>
                                    <FormGroup>
                                        <FormControl
                                            type="text"
                                            placeholder="Question"
                                            value={question.title}
                                            onChange={(e) => handleQuestionChange(qIndex, "title", e.target.value)}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col sm={4}>
                                    <FormSelect
                                        value={question.type}
                                        onChange={(e) => handleQuestionChange(qIndex, "type", e.target.value)}>
                                        <option value="SINGLE_CHOICE">Single Choice</option>
                                        <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                                        <option value="TRUE_FALSE">True / False</option>
                                        <option value="FILL_IN_BLANK">Fill in the Blank</option>
                                    </FormSelect>
                                </Col>
                                <Col sm={3}>
                                    <FormGroup className="d-flex align-items-center gap-2">
                                        <FormLabel className="fw-bold mb-0">Pts</FormLabel>
                                        <FormControl
                                            type="number"
                                            value={question.points}
                                            onChange={(e) => handleQuestionChange(qIndex, "points", e.target.value)}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col sm={2}>
                                    <Button variant="danger" onClick={() => removeQuestion(qIndex)}>
                                        <FaTrash />
                                    </Button>
                                </Col>
                            </Row>

                            <hr/>

                            <FormGroup className="mb-3">
                                <FormLabel className="fw-bold">Question</FormLabel>
                                <FormControl as = "textarea" rows = {3}
                                             placeholder = "Enter question text here"
                                             value={question.question}
                                             onChange={(e) => handleQuestionChange(qIndex, "question", e.target.value)}
                                />
                            </FormGroup>
                            {/* MCQ, This is MCMC, for SCMC Need to change schema, need to change entries... headache. */}
                            {(question.type === "SINGLE_CHOICE" || question.type === "MULTIPLE_CHOICE") && (
                                <div>
                                    <FormLabel className="fw-bold">
                                        Choices ({question.type === "SINGLE_CHOICE" ? "Select one correct answer" : "Select all correct answers"})
                                    </FormLabel>
                                    {question.choices.map((choice: any, cIndex: number) => (
                                        <div key={cIndex} className="d-flex align-items-center mb-2">
                                            <FormCheck
                                                type={question.type === "SINGLE_CHOICE" ? "radio" : "checkbox"}
                                                name={`correctChoice-${qIndex}`}
                                                checked={choice.isCorrect}
                                                className="me-2"
                                                onChange={() => setCorrectChoice(qIndex, cIndex)}
                                            />
                                            <FormControl
                                                type="text"
                                                value={choice.text}
                                                onChange={(e) => updateChoice(qIndex, cIndex, e.target.value)}
                                                className="me-2"
                                            />
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => removeChoice(qIndex, cIndex)}
                                            >
                                                <FaTrash />
                                            </Button>
                                        </div>
                                    ))}
                                    <div className="text-end">
                                        <Button variant="link" onClick={() => addChoice(qIndex)} className="text-decoration-none text-danger">
                                            + Add Another Answer
                                        </Button>
                                    </div>
                                </div>
                            )}
                            {/* T&F */}
                            {question.type === "TRUE_FALSE" && (
                                <div>
                                    <FormLabel className="fw-bold">Select Correct Answer</FormLabel>
                                    <FormCheck
                                        type="radio"
                                        label="True"
                                        checked={question.correctAnswer === true}
                                        className="mb-2"
                                        name = {`trueFalse-${qIndex}`}
                                        onChange={() => handleQuestionChange(qIndex, "correctAnswer", true)}
                                    />
                                    <FormCheck
                                        type="radio"
                                        label="False"
                                        checked={question.correctAnswer === false}
                                        className="mb-2"
                                        name = {`trueFalse-${qIndex}`}
                                        onChange={() => handleQuestionChange(qIndex, "correctAnswer", false)}
                                    />
                                </div>
                            )}
                            {/* FBI */}
                            {question.type === "FILL_IN_BLANK" && (
                                <div>
                                    <FormLabel className="fw-bold">Blanks</FormLabel>
                                    <div className="text-muted small mb-2">
                                        Add multiple blanks for your question.
                                    </div>

                                    {question.blanks && question.blanks.length > 0 ? (
                                        question.blanks.map((blank: any, bIndex: number) => (
                                            <div key={blank.id} className="border rounded p-3 mb-3 bg-light">
                                                <div className="d-flex justify-content-between align-items-center mb-2">
                                                    <strong>Blank {bIndex + 1}</strong>
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        onClick={() => removeBlank(qIndex, bIndex)}
                                                    >
                                                        <FaTrash />
                                                    </Button>
                                                </div>
                                                <FormGroup>
                                                    <FormLabel className="small">Correct Answer</FormLabel>
                                                    <FormControl
                                                        type="text"
                                                        placeholder="e.g., React, react.js, ReactJS"
                                                        value={blank.possibleAnswers ? blank.possibleAnswers.join(", ") : ""}
                                                        onChange={(e) => updateBlankAnswers(qIndex, bIndex, e.target.value)}
                                                    />
                                                    <Form.Text className="text-muted">
                                                        Enter multiple answers separated by commas for case-insensitive matching
                                                    </Form.Text>
                                                </FormGroup>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-muted text-center p-3 border rounded mb-3">
                                            No blanks added yet. Click "Add Blank" to create one.
                                        </div>
                                    )}

                                    <div className="text-end">
                                        <Button
                                            variant="link"
                                            onClick={() => addBlank(qIndex)}
                                            className="text-decoration-none text-danger"
                                        >
                                            <FaPlus className="me-1" /> Add Blank
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
            <hr/>

            <div className="d-flex justify-content-end">
                {isFaculty && (
                    <>
                        <Link href={`/Courses/${cid}/Quizzes`}>
                            <Button id="wd-cancel-btn" variant="light" className="border me-2">Cancel</Button>
                        </Link>
                        <Button id="wd-save-btn" variant="danger" className="border me-2" onClick={() => handleSave(false)}>Save</Button>
                        <Button id="wd-save-btn" variant="danger" onClick={() => handleSave(true)}>Save and Publish</Button>
                    </>
                )}
                {!isFaculty && (
                    <Link href={`/Courses/${cid}/Quizzes`}>
                        <Button id="wd-cancel-btn" variant="light" className="border me-2">Back</Button>
                    </Link>
                )}
            </div>
        </div>
    );
}
