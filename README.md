# LearnMate Assessment Creation System

A modern, responsive web application for creating and managing educational assessments with a clean white and blue theme.

## Features

### ✅ Admin Assessment Creation Form
- **Course Selection**: Dropdown with pre-populated courses
- **Assessment Details**: Title, Duration, Marks, Attempts configuration
- **Dynamic Question Builder**: Add/remove MCQ questions with multiple options
- **Status Management**: Draft, Published, Archived states
- **Real-time Validation**: Form validation with helpful error messages
- **Responsive Design**: Works seamlessly on desktop and mobile

### 🎨 Design Features
- Clean white and blue theme
- Material-UI components with custom styling
- Smooth animations and transitions
- Professional typography using Inter font
- Intuitive user interface with clear visual hierarchy

### 📋 Form Fields
- **Course Selection**: Dropdown list of available courses
- **Assessment Title**: Text input for assessment name
- **Duration**: Number input for time limit in minutes
- **Total Marks**: Overall assessment scoring
- **Passing Marks**: Minimum score required to pass
- **Attempts Allowed**: Number of attempts students can make
- **Instructions**: Rich text area for student guidelines
- **Questions**: Dynamic list with MCQ support
- **Status**: Radio buttons for Draft/Published/Archived

### 🔧 Technical Stack
- **React 18**: Modern React with hooks
- **Material-UI 5**: Component library with custom theming
- **React Hook Form**: Efficient form handling and validation
- **UUID**: Unique identifiers for questions
- **Responsive Grid**: Mobile-first responsive design

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd learnmate-assessment
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── AssessmentCreationForm.js    # Main assessment form component
│   └── QuestionBuilder.js           # Dynamic question builder component
├── App.js                           # Main app component with theme
├── App.css                          # App-specific styles
├── index.js                         # React entry point
└── index.css                        # Global styles
```

## Usage

1. **Select Course**: Choose from the dropdown of available courses
2. **Fill Basic Info**: Enter assessment title, duration, marks, and attempts
3. **Add Instructions**: Provide clear guidelines for students
4. **Create Questions**: 
   - Add MCQ questions with multiple options
   - Set marks for each question
   - Select correct answers
   - Add/remove questions as needed
5. **Set Status**: Choose between Draft, Published, or Archived
6. **Save**: Submit the form to create the assessment

## Customization

### Theme Colors
The app uses a custom Material-UI theme with:
- **Primary**: Blue (#2196F3)
- **Secondary**: Teal (#03DAC6)
- **Background**: Light gray (#f8fafc)
- **Paper**: White (#ffffff)

### Adding New Question Types
Currently supports MCQ. To add new question types:
1. Update the question type enum in `QuestionBuilder.js`
2. Add conditional rendering for new question types
3. Update validation rules accordingly

## Future Enhancements

- Short Answer questions
- Coding questions with syntax highlighting
- File upload questions
- Question bank integration
- Assessment preview mode
- Bulk question import
- Advanced analytics

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.