export type AcademyLesson = {
  title: string;
  content: string[];
  practical?: string[];
};

export type AcademyModule = {
  title: string;
  objective: string;
  lessons: AcademyLesson[];
  quiz: { question: string; options: string[]; answer: number }[];
};

export const computerFundamentalsCourse = {
  slug: "computer-fundamentals",
  title: "Computer Fundamentals & Basic Computer Skills",
  subtitle: "A practical beginner-to-confident computer course with quizzes, assignments and a final certification exam.",
  price: 799,
  duration: "15–20 hours",
  level: "Beginner",
  passingScore: 70,
  finalExamQuestions: 100,
  certificate: true,
  modules: [
    {
      title: "Understanding Computers",
      objective: "Understand what computers are, how they evolved and where different types are used.",
      lessons: [
        { title: "What is a computer?", content: ["A computer is an electronic system that accepts input, processes information according to instructions, stores data and produces output.", "The basic cycle is input → processing → storage → output. Computers can repeat instructions quickly and consistently, but they depend on the instructions and data provided by people."], practical: ["Identify three computers you use in daily life and describe their input, processing and output."] },
        { title: "Types of computers", content: ["Common categories include desktops, laptops, tablets, smartphones, workstations and servers. Specialized systems such as embedded computers are built into cars, appliances and industrial equipment.", "Choose a computer according to the task: portability, processing power, storage, display size, connectivity and budget all matter."] },
        { title: "Advantages and limitations", content: ["Computers provide speed, accuracy, storage and automation. They do not independently understand goals or guarantee correct results; poor data, incorrect instructions and security threats can produce poor outcomes."] }
      ],
      quiz: [
        { question: "Which sequence best describes the basic computer cycle?", options: ["Input → processing → output", "Output → input → shutdown", "Storage → printing → typing", "Internet → CPU → keyboard"], answer: 0 },
        { question: "Which is an example of an embedded computer?", options: ["A car control system", "A paper notebook", "A desk lamp with no electronics", "A printed photograph"], answer: 0 }
      ]
    },
    {
      title: "Computer Hardware",
      objective: "Identify the major internal components and understand their roles.",
      lessons: [
        { title: "CPU and motherboard", content: ["The CPU executes instructions and performs calculations. The motherboard connects major components and provides communication pathways between them."] },
        { title: "RAM, storage and GPU", content: ["RAM is fast working memory used by active programs. SSDs and HDDs provide persistent storage. A GPU is specialized for graphics and parallel workloads.", "More RAM can help with multitasking, while an SSD usually improves startup and application loading compared with a traditional HDD."] },
        { title: "Ports and connectors", content: ["Common ports include USB for peripherals and data, HDMI for digital display/audio, Ethernet for wired networking and 3.5 mm audio connections on supported devices."] }
      ],
      quiz: [
        { question: "Which component executes program instructions?", options: ["CPU", "Monitor", "Keyboard", "Printer"], answer: 0 },
        { question: "Which is normally persistent storage?", options: ["RAM", "CPU cache", "SSD", "CPU register"], answer: 2 }
      ]
    },
    {
      title: "Input and Output Devices",
      objective: "Recognize common input and output devices and explain their purpose.",
      lessons: [
        { title: "Input devices", content: ["Keyboards, mice, touchscreens, scanners, microphones and webcams send information or commands into a computer."] },
        { title: "Output devices", content: ["Monitors, printers, speakers and projectors present processed information to the user.", "Some devices can perform both roles. A touchscreen, for example, displays information and accepts touch input."] }
      ],
      quiz: [
        { question: "Which is primarily an input device?", options: ["Scanner", "Monitor", "Speaker", "Projector"], answer: 0 },
        { question: "Which device produces a physical paper copy?", options: ["Printer", "Webcam", "Mouse", "Microphone"], answer: 0 }
      ]
    },
    {
      title: "Software Fundamentals",
      objective: "Understand operating systems, applications, drivers and software licensing concepts.",
      lessons: [
        { title: "System and application software", content: ["System software manages core computer functions. Operating systems are the main example. Application software helps users perform tasks such as writing, accounting, design or communication."] },
        { title: "Drivers, firmware and updates", content: ["Drivers allow the operating system to communicate with hardware. Firmware provides low-level instructions stored on a device. Updates can add features and, importantly, fix security vulnerabilities."] },
        { title: "Installing and uninstalling applications", content: ["Use trusted sources and review permissions before installing software. Uninstall applications through the operating system's supported method rather than deleting random program files."] }
      ],
      quiz: [
        { question: "What is the primary role of an operating system?", options: ["Manage computer resources and provide a platform for applications", "Print every document", "Replace the CPU", "Create internet cables"], answer: 0 },
        { question: "Why are software updates important?", options: ["They can fix security and reliability problems", "They always increase storage", "They remove the operating system", "They disable all passwords"], answer: 0 }
      ]
    },
    {
      title: "Windows and Operating System Skills",
      objective: "Navigate a desktop operating system confidently and manage basic settings.",
      lessons: [
        { title: "Desktop, Start menu and taskbar", content: ["The desktop provides access to shortcuts and files. The Start menu provides applications and system controls. The taskbar provides quick access to running and pinned applications."] },
        { title: "Settings and user accounts", content: ["Use settings to manage display, network, devices, accounts, privacy and updates. Separate user accounts can help keep personal work isolated on shared computers."] },
        { title: "Shutdown, restart and sleep", content: ["Restarting can clear temporary software problems. Sleep uses less power while allowing a quick return to work. Shut down when you will not use the computer for an extended period or when required for maintenance."] }
      ],
      quiz: [
        { question: "Where can you normally find installed applications quickly in Windows?", options: ["Start menu", "Recycle Bin only", "Printer tray", "HDMI port"], answer: 0 },
        { question: "What is a common reason to restart a computer?", options: ["Apply updates or clear temporary software issues", "Increase monitor size", "Create RAM physically", "Change the keyboard language permanently"], answer: 0 }
      ]
    },
    {
      title: "Keyboard and Mouse Mastery",
      objective: "Use common keys, mouse actions and shortcuts to work faster.",
      lessons: [
        { title: "Essential keys", content: ["Enter confirms an action, Backspace removes characters to the left, Delete removes selected content or characters, Tab moves between fields and Esc commonly cancels or closes a temporary action."] },
        { title: "Essential shortcuts", content: ["Ctrl+C copies, Ctrl+X cuts, Ctrl+V pastes, Ctrl+Z undoes, Ctrl+Y often redoes, Ctrl+A selects all and Ctrl+S saves in many applications. Exact shortcuts can vary by application."] },
        { title: "Mouse skills", content: ["Click selects, double-click often opens, right-click opens a context menu and drag-and-drop moves or selects objects depending on the application."] }
      ],
      quiz: [
        { question: "Which shortcut normally copies selected content?", options: ["Ctrl+C", "Ctrl+P", "Ctrl+N", "Ctrl+Q"], answer: 0 },
        { question: "What does Ctrl+Z commonly do?", options: ["Undo", "Print", "Zoom", "Close Windows"], answer: 0 }
      ]
    },
    {
      title: "Files, Folders and Storage",
      objective: "Organize files, understand extensions and use local and cloud storage safely.",
      lessons: [
        { title: "Files and folders", content: ["Files contain information; folders organize files. Use clear names and a consistent folder structure so documents can be found later."] },
        { title: "Copy, move, rename and delete", content: ["Copy creates another instance, move changes location, rename changes the name and delete removes an item from its current location. Deleted files may remain in a Recycle Bin until permanently removed."] },
        { title: "File extensions and ZIP files", content: ["Extensions such as .pdf, .docx, .xlsx and .jpg help identify file types. ZIP archives group and compress files for convenient transfer."] },
        { title: "Backup and cloud storage", content: ["Important files should have independent backups. Cloud storage can improve accessibility but should not be treated as the only copy of critical information."] }
      ],
      quiz: [
        { question: "Which extension is commonly associated with a PDF document?", options: [".pdf", ".mp3", ".exe", ".png"], answer: 0 },
        { question: "What is the main purpose of a folder?", options: ["Organize files", "Increase CPU speed", "Replace RAM", "Connect HDMI"], answer: 0 }
      ]
    },
    {
      title: "Internet Fundamentals",
      objective: "Use browsers, search engines, URLs, downloads and network connections safely.",
      lessons: [
        { title: "Internet and web basics", content: ["The internet is a global network of connected systems. The web is a service that uses the internet to provide websites and web applications."] },
        { title: "Browsers, URLs and search", content: ["A browser retrieves and displays web content. A URL identifies a web resource. Search engines help discover information, but users should evaluate sources before trusting results."] },
        { title: "Downloads and uploads", content: ["Downloading transfers data to your device; uploading transfers data from your device to another system. Verify file sources before opening downloads."] },
        { title: "Wi-Fi and Ethernet", content: ["Wi-Fi provides wireless network access. Ethernet provides a wired connection. Both can provide internet access through a router or other network equipment."] }
      ],
      quiz: [
        { question: "What does a browser primarily do?", options: ["Access and display web content", "Replace RAM", "Print documents automatically", "Charge a laptop"], answer: 0 },
        { question: "What is an upload?", options: ["Sending data from your device to another system", "Deleting a file", "Turning off Wi-Fi", "Printing a document"], answer: 0 }
      ]
    },
    {
      title: "Email and Digital Communication",
      objective: "Send professional emails, manage attachments and use CC/BCC appropriately.",
      lessons: [
        { title: "Email anatomy", content: ["A typical email includes recipient, subject and message. Attachments add files. Reply continues a conversation while Forward sends a message to another recipient."] },
        { title: "CC and BCC", content: ["CC is used when additional recipients should be visible to others. BCC hides recipients from one another and is useful for privacy when sending a message to a group that does not need to see each other's addresses."] },
        { title: "Email safety and etiquette", content: ["Check recipients and attachments before sending. Avoid opening unexpected links or attachments. Use clear subjects and concise, professional language."] }
      ],
      quiz: [
        { question: "What is BCC useful for?", options: ["Hiding recipient addresses from other recipients", "Increasing RAM", "Adding a printer", "Formatting a hard drive"], answer: 0 },
        { question: "What should you do before opening an unexpected attachment?", options: ["Verify the sender and context", "Always open it immediately", "Forward it to everyone", "Disable all security"], answer: 0 }
      ]
    },
    {
      title: "Cybersecurity Basics",
      objective: "Recognize common digital threats and apply safe computing habits.",
      lessons: [
        { title: "Passwords and MFA", content: ["Use long, unique passwords and avoid reusing important passwords. Multi-factor authentication adds another verification step and can reduce account takeover risk."] },
        { title: "Phishing and scams", content: ["Phishing attempts trick people into revealing information or installing malicious software. Warning signs can include urgency, unexpected requests, suspicious domains and unusual payment instructions."] },
        { title: "Malware and safe downloads", content: ["Malware includes malicious programs such as ransomware, spyware and some viruses. Keep software updated and download applications from reputable sources."] },
        { title: "Privacy and public Wi-Fi", content: ["Limit unnecessary personal information sharing. On public networks, avoid sensitive actions when the connection cannot be trusted and use secure, encrypted services."] }
      ],
      quiz: [
        { question: "What does MFA add to an account?", options: ["An additional verification factor", "More storage", "A faster CPU", "A new monitor"], answer: 0 },
        { question: "Which is a common phishing warning sign?", options: ["Unexpected urgency and a suspicious link", "A normal saved document", "A local keyboard shortcut", "A known printer driver"], answer: 0 }
      ]
    },
    {
      title: "Office Productivity Fundamentals",
      objective: "Understand the basic purpose of Word, Excel, PowerPoint and PDF workflows.",
      lessons: [
        { title: "Word processing", content: ["Word processors are used to create and format documents. Basic skills include typing, selecting text, formatting, saving, printing and exporting to PDF."] },
        { title: "Spreadsheets", content: ["Spreadsheets organize information in rows and columns. Cells can contain text, numbers and formulas. Simple formulas support calculations and reporting."] },
        { title: "Presentations", content: ["Presentation software organizes information into slides. Keep slides readable, use consistent formatting and avoid overcrowding each slide with text."] },
        { title: "PDF workflow", content: ["PDF is commonly used for sharing documents while preserving layout. Before sharing a PDF, verify the content, file name and privacy of included information."] }
      ],
      quiz: [
        { question: "Which application category is best suited to rows, columns and formulas?", options: ["Spreadsheet", "Presentation", "Image viewer", "Music player"], answer: 0 },
        { question: "Why are PDFs commonly used for sharing documents?", options: ["They help preserve document layout across systems", "They always contain editable formulas", "They replace the internet", "They increase RAM"], answer: 0 }
      ]
    },
    {
      title: "Printing, Scanning and Troubleshooting",
      objective: "Perform common print/scan tasks and solve basic computer problems methodically.",
      lessons: [
        { title: "Printing basics", content: ["Check the correct printer, paper size, orientation, page range and number of copies before printing. Previewing can prevent wasted paper."] },
        { title: "Scanning basics", content: ["Place the document correctly, choose an appropriate resolution and save the scan in a suitable format. Use PDF for multi-page document workflows when appropriate."] },
        { title: "Basic troubleshooting method", content: ["Define the symptom, check simple causes, restart the affected application or device when appropriate, verify cables/network connections and test one change at a time. Record what worked."] },
        { title: "When to seek support", content: ["Escalate hardware failures, suspected malware, data loss, electrical issues and advanced configuration problems rather than experimenting with risky changes."] }
      ],
      quiz: [
        { question: "What is a good first step in troubleshooting?", options: ["Clearly identify the symptom", "Replace every component", "Delete all files", "Disable security"], answer: 0 },
        { question: "What should you check before printing?", options: ["Printer, paper size and page settings", "Only the wallpaper", "The CPU brand", "The email password"], answer: 0 }
      ]
    },
    {
      title: "Practical Computer Skills",
      objective: "Combine the course skills into realistic everyday computer tasks.",
      lessons: [
        { title: "Practical task 1: Organize documents", content: ["Create a folder called Job Documents with subfolders for Resume, Certificates and Applications. Rename files consistently and remove unnecessary duplicates."], practical: ["Submit a screenshot or instructor-approved evidence of the completed folder structure."] },
        { title: "Practical task 2: Create and share a document", content: ["Create a one-page professional document, save the editable version, export a PDF and attach it to an email draft."], practical: ["Check file name, spelling, PDF appearance and attachment before submission."] },
        { title: "Practical task 3: Basic office workflow", content: ["Create a small spreadsheet containing five products and prices, calculate a total, create a simple presentation about the same business and save both files."], practical: ["Keep the files in a named project folder and create a backup copy."] },
        { title: "Practical task 4: Security check", content: ["Review a sample email and identify suspicious links, requests, attachments and sender details. Explain what you would do instead of clicking."], practical: ["Write five safety rules you will follow in daily computer use."] }
      ],
      quiz: [
        { question: "What is the best way to finish an important document workflow?", options: ["Save, verify and back up the final file", "Delete the original immediately", "Send without checking", "Disable security first"], answer: 0 },
        { question: "What should a learner do with a suspicious email?", options: ["Verify it and avoid unsafe links or attachments", "Click every link", "Send passwords by reply", "Disable MFA"], answer: 0 }
      ]
    }
  ] as AcademyModule[],
  practicalAssignments: [
    "Build an organized personal Documents folder with at least three subfolders and five clearly named files.",
    "Create a one-page professional document and export it as PDF.",
    "Create a spreadsheet with five items, prices and a total formula.",
    "Create a five-slide presentation introducing a fictional small business.",
    "Draft a professional email with a PDF attachment.",
    "Complete a cybersecurity review of five sample messages and identify the risky ones."
  ],
  finalExamBlueprint: {
    total: 100,
    passingScore: 70,
    sections: [
      { name: "Computer fundamentals", questions: 15 },
      { name: "Hardware and devices", questions: 15 },
      { name: "Software and operating systems", questions: 15 },
      { name: "Files, storage and productivity", questions: 15 },
      { name: "Internet and email", questions: 15 },
      { name: "Cybersecurity", questions: 15 },
      { name: "Troubleshooting and practical skills", questions: 10 }
    ]
  },
  certificate: {
    issuer: "DisplayAvenue Academy",
    title: "Certificate of Completion",
    course: "Computer Fundamentals & Basic Computer Skills",
    verificationPath: "/academy/certificates/verify/{certificateId}",
    rule: "Issued automatically only when the learner completes the required lessons and achieves at least 70% in the final examination."
  }
};
