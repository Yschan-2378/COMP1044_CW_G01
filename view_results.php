<?php
session_start();
require_once 'db.php';

if (!isset($_SESSION['user_id'])) {
    die("Access Denied. Please log in.");
}

$role = $_SESSION['role'];
$user_id = $_SESSION['user_id'];

$search_query = "";
$search_param = "%";

if (isset($_GET['search'])) {
    $search_query = $_GET['search'];
    $search_param = "%" . $search_query . "%";
}

if ($role == 'Admin') {
    //fetch all students and their final grades
    $sql = "SELECT s.student_id, s.student_name, i.company_name, a.final_calculated_score 
            FROM Students s
            JOIN Internships i ON s.student_id = i.student_id
            LEFT JOIN Assessments a ON i.internship_id = a.internship_id
            WHERE s.student_name LIKE :search OR s.student_id LIKE :search";

    $stmt = $pdo->prepare($sql);
    $stmt->execute(['search' => $search_param]);

} else {
    //fetch only assigned students + detailed marks and comments
    $sql = "SELECT s.student_id, s.student_name, i.company_name, 
                   a.task_mark, a.safety_mark, a.knowledge_mark, a.report_mark, 
                   a.clarity_mark, a.learning_mark, a.project_mgt_mark, a.time_mgt_mark, 
                   a.qualitative_comments, a.final_calculated_score 
            FROM Students s
            JOIN Internships i ON s.student_id = i.student_id
            LEFT JOIN Assessments a ON i.internship_id = a.internship_id
            WHERE i.assessor_id = :user_id 
            AND (s.student_name LIKE :search OR s.student_id LIKE :search)";

    $stmt = $pdo->prepare($sql);
    $stmt->execute(['user_id' => $user_id, 'search' => $search_param]);
}

$results = $stmt->fetchAll();
?>

<!DOCTYPE html>
<html>


<head>
    <style>
        table {
            border-collapse: collapse;
            width: 100%;
        }

        th,
        td {
            border: 1px solid black;
            padding: 8px;
            text-align: left;
            vertical-align: top;
        }

        th {
            background-color: #f2f2f2;
        }

        .chart-container {
            width: 250px;
            height: 250px;
            margin: auto;
        }
    </style>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>

<body>
    <h1>Internship Results</h1>

    <?php if ($role == 'Admin'): ?>
        <a href="dashboard.php">← Back to Admin Dashboard</a>
    <?php else: ?>
        <a href="assessor_dashboard.php">← Back to Assessor Dashboard</a>
    <?php endif; ?>
    <hr>

    <form method="GET" action="view_results.php">
        <label>Search by Name or ID:</label>
        <input type="text" name="search" value="<?php echo htmlspecialchars($search_query); ?>"
            placeholder="e.g. S12345">
        <button type="submit">Search</button>
        <a href="view_results.php"><button type="button">Clear</button></a>
    </form>
    <br>

    <table>
        <tr>
            <th>Student ID</th>
            <th>Student Name</th>
            <th>Company</th>

            <?php if ($role == 'Assessor'): ?>
                <th>Task</th>
                <th>Safety</th>
                <th>Knowledge</th>
                <th>Report</th>
                <th>Clarity</th>
                <th>Learning</th>
                <th>Project Mgt</th>
                <th>Time Mgt</th>
                <th>Comments</th>
                <th>Skill Radar</th>
            <?php endif; ?>

            <th>Final Score</th>
        </tr>

        <?php if (count($results) > 0): ?>
            <?php foreach ($results as $row): ?>
                <tr>
                    <td><?php echo htmlspecialchars($row['student_id']); ?></td>
                    <td><?php echo htmlspecialchars($row['student_name']); ?></td>
                    <td><?php echo htmlspecialchars($row['company_name']); ?></td>

                    <?php if ($role == 'Assessor'): ?>
                        <td><?php echo htmlspecialchars($row['task_mark'] ?? '-'); ?></td>
                        <td><?php echo htmlspecialchars($row['safety_mark'] ?? '-'); ?></td>
                        <td><?php echo htmlspecialchars($row['knowledge_mark'] ?? '-'); ?></td>
                        <td><?php echo htmlspecialchars($row['report_mark'] ?? '-'); ?></td>
                        <td><?php echo htmlspecialchars($row['clarity_mark'] ?? '-'); ?></td>
                        <td><?php echo htmlspecialchars($row['learning_mark'] ?? '-'); ?></td>
                        <td><?php echo htmlspecialchars($row['project_mgt_mark'] ?? '-'); ?></td>
                        <td><?php echo htmlspecialchars($row['time_mgt_mark'] ?? '-'); ?></td>
                        <td><?php echo htmlspecialchars($row['qualitative_comments'] ?? '-'); ?></td>

                        <td>
                            <?php if ($row['final_calculated_score'] !== null): ?>
                                <?php $unique_chart_id = uniqid('radar_'); ?>

                                <div class="chart-container">
                                    <canvas id="<?php echo $unique_chart_id; ?>"></canvas>
                                </div>

                                <script>
                                    document.addEventListener('DOMContentLoaded', function () {
                                        const ctx = document.getElementById('<?php echo $unique_chart_id; ?>').getContext('2d');

                                        new Chart(ctx, {
                                            type: 'radar',
                                            data: {
                                                labels: [
                                                    'Task', 'Safety', 'Knowledge',
                                                    'Report', 'Clarity', 'Learning',
                                                    'Proj Mgt', 'Time Mgt'
                                                ],
                                                datasets: [{
                                                    label: 'Student Score (%)',
                                                    data: [
                                                        <?php echo $row['task_mark'] ?? 0; ?>,
                                                        <?php echo $row['safety_mark'] ?? 0; ?>,
                                                        <?php echo $row['knowledge_mark'] ?? 0; ?>,
                                                        <?php echo $row['report_mark'] ?? 0; ?>,
                                                        <?php echo $row['clarity_mark'] ?? 0; ?>,
                                                        <?php echo $row['learning_mark'] ?? 0; ?>,
                                                        <?php echo $row['project_mgt_mark'] ?? 0; ?>,
                                                        <?php echo $row['time_mgt_mark'] ?? 0; ?>
                                                    ],
                                                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                                                    borderColor: 'rgba(54, 162, 235, 1)',
                                                    pointBackgroundColor: 'rgba(255, 99, 132, 1)',
                                                    borderWidth: 2
                                                }]
                                            },
                                            options: {
                                                scales: {
                                                    r: {
                                                        angleLines: { display: true },
                                                        suggestedMin: 0,
                                                        suggestedMax: 100
                                                    }
                                                },
                                                plugins: { legend: { display: false } }
                                            }
                                        });
                                    });
                                </script>
                            <?php else: ?>
                                <span style='color:gray;'>Awaiting Grades</span>
                            <?php endif; ?>
                        </td>


                    <?php endif; ?>

                    <td>
                        <?php
                        if ($row['final_calculated_score'] !== null) {
                            echo "<strong>" . htmlspecialchars($row['final_calculated_score']) . "%</strong>";
                        } else {
                            echo "<span style='color:gray;'>Not Graded Yet</span>";
                        }
                        ?>
                    </td>
                </tr>
            <?php endforeach; ?>
        <?php else: ?>
            <tr>
                <td colspan="100%">No results found.</td>
            </tr>
        <?php endif; ?>
    </table>

</body>

</html>