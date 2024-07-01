SELECT
  u.name,
  u.phone_number,
  (u.id || '-user' :: text) AS unique_id,
  u.id AS original_id,
  'user' :: text AS TYPE,
  sr.spam_count,
  sr.non_spam_count,
  u.email
FROM
  (
    "User" u
    LEFT JOIN (
      SELECT
        "SpamReport"."phoneNumber",
        count("SpamReport"."phoneNumber") FILTER (
          WHERE
            ("SpamReport".spam = TRUE)
        ) AS spam_count,
        count("SpamReport"."phoneNumber") FILTER (
          WHERE
            ("SpamReport".spam = false)
        ) AS non_spam_count
      FROM
        "SpamReport"
      GROUP BY
        "SpamReport"."phoneNumber"
    ) sr ON ((sr."phoneNumber" = u.phone_number))
  )
UNION
SELECT
  c.name,
  c.phone_number,
  (c.id || '-contact' :: text) AS unique_id,
  c.id AS original_id,
  'contact' :: text AS TYPE,
  sr.spam_count,
  sr.non_spam_count,
  '' :: text AS email
FROM
  (
    "Contact" c
    LEFT JOIN (
      SELECT
        "SpamReport"."phoneNumber",
        count("SpamReport"."phoneNumber") FILTER (
          WHERE
            ("SpamReport".spam = TRUE)
        ) AS spam_count,
        count("SpamReport"."phoneNumber") FILTER (
          WHERE
            ("SpamReport".spam = false)
        ) AS non_spam_count
      FROM
        "SpamReport"
      GROUP BY
        "SpamReport"."phoneNumber"
    ) sr ON ((sr."phoneNumber" = c.phone_number))
  );