#!/usr/bin/env python3
"""
اختبار واجهة OpenAI API
هذا السكريبت يختبر الاتصال بـ OpenAI API ويعرض قدراته المختلفة
"""

from openai import OpenAI


def test_connection():
    """اختبار الاتصال الأساسي بـ API"""
    print("=" * 60)
    print("🔗 اختبار الاتصال بـ OpenAI API")
    print("=" * 60)

    try:
        client = OpenAI()
        print("✅ تم إنشاء عميل OpenAI بنجاح")
        return client
    except Exception as exc:
        print(f"❌ خطأ في الاتصال: {exc}")
        return None


def _print_response_text(response):
    if hasattr(response, "output_text"):
        print(response.output_text)
        return

    if hasattr(response, "output"):
        for item in response.output:
            if hasattr(item, "content"):
                for content in item.content:
                    if hasattr(content, "text"):
                        print(content.text)
        return

    print(response)


def test_text_generation(client):
    """اختبار توليد النصوص"""
    print("\n" + "=" * 60)
    print("📝 اختبار توليد النصوص")
    print("=" * 60)

    try:
        response = client.responses.create(
            model="gpt-4o-mini",
            input="اكتب فقرة قصيرة عن أهمية الذكاء الاصطناعي في العصر الحديث.",
        )

        print("\n🎯 الطلب: اكتب فقرة قصيرة عن أهمية الذكاء الاصطناعي")
        print("\n📄 الاستجابة:")
        print("-" * 40)

        _print_response_text(response)

        print("-" * 40)
        print("✅ تم توليد النص بنجاح")
        return True
    except Exception as exc:
        print(f"❌ خطأ في توليد النص: {exc}")
        return False


def test_creative_writing(client):
    """اختبار الكتابة الإبداعية"""
    print("\n" + "=" * 60)
    print("✨ اختبار الكتابة الإبداعية")
    print("=" * 60)

    try:
        response = client.responses.create(
            model="gpt-4o-mini",
            input="اكتب قصيدة قصيرة من أربعة أبيات عن الأمل والتفاؤل.",
        )

        print("\n🎯 الطلب: قصيدة قصيرة عن الأمل والتفاؤل")
        print("\n📄 الاستجابة:")
        print("-" * 40)

        _print_response_text(response)

        print("-" * 40)
        print("✅ تم إنشاء المحتوى الإبداعي بنجاح")
        return True
    except Exception as exc:
        print(f"❌ خطأ في الكتابة الإبداعية: {exc}")
        return False


def test_code_generation(client):
    """اختبار توليد الكود"""
    print("\n" + "=" * 60)
    print("💻 اختبار توليد الكود البرمجي")
    print("=" * 60)

    try:
        response = client.responses.create(
            model="gpt-4o-mini",
            input="اكتب دالة Python بسيطة لحساب مضروب عدد (factorial) مع شرح مختصر.",
        )

        print("\n🎯 الطلب: دالة Python لحساب المضروب")
        print("\n📄 الاستجابة:")
        print("-" * 40)

        _print_response_text(response)

        print("-" * 40)
        print("✅ تم توليد الكود بنجاح")
        return True
    except Exception as exc:
        print(f"❌ خطأ في توليد الكود: {exc}")
        return False


def test_translation(client):
    """اختبار الترجمة"""
    print("\n" + "=" * 60)
    print("🌍 اختبار الترجمة")
    print("=" * 60)

    try:
        response = client.responses.create(
            model="gpt-4o-mini",
            input=(
                "ترجم الجملة التالية إلى الإنجليزية والفرنسية: "
                "'التعلم المستمر هو مفتاح النجاح في الحياة'"
            ),
        )

        print("\n🎯 الطلب: ترجمة جملة إلى الإنجليزية والفرنسية")
        print("\n📄 الاستجابة:")
        print("-" * 40)

        _print_response_text(response)

        print("-" * 40)
        print("✅ تمت الترجمة بنجاح")
        return True
    except Exception as exc:
        print(f"❌ خطأ في الترجمة: {exc}")
        return False


def test_summarization(client):
    """اختبار التلخيص"""
    print("\n" + "=" * 60)
    print("📋 اختبار التلخيص")
    print("=" * 60)

    long_text = """
    الذكاء الاصطناعي هو فرع من علوم الحاسوب يهدف إلى إنشاء أنظمة قادرة على أداء مهام تتطلب عادةً
    الذكاء البشري. يشمل ذلك التعلم الآلي، ومعالجة اللغة الطبيعية، والرؤية الحاسوبية، والروبوتات.
    في السنوات الأخيرة، شهد هذا المجال تطوراً هائلاً بفضل زيادة قوة الحوسبة وتوفر كميات ضخمة من البيانات.
    تُستخدم تقنيات الذكاء الاصطناعي اليوم في مجالات متعددة مثل الرعاية الصحية والتمويل والتعليم والنقل.
    ومع ذلك، تثير هذه التقنيات أيضاً تساؤلات أخلاقية حول الخصوصية والتوظيف ومستقبل العمل البشري.
    """

    try:
        response = client.responses.create(
            model="gpt-4o-mini",
            input=f"لخص النص التالي في جملتين: {long_text}",
        )

        print("\n🎯 الطلب: تلخيص نص طويل عن الذكاء الاصطناعي")
        print("\n📄 الاستجابة:")
        print("-" * 40)

        _print_response_text(response)

        print("-" * 40)
        print("✅ تم التلخيص بنجاح")
        return True
    except Exception as exc:
        print(f"❌ خطأ في التلخيص: {exc}")
        return False


def main():
    """الدالة الرئيسية"""
    print("\n" + "=" * 60)
    print("🚀 بدء اختبار OpenAI API")
    print("=" * 60)

    client = test_connection()
    if not client:
        print("\n❌ فشل الاتصال بـ API. يرجى التحقق من مفتاح API.")
        return

    results = {
        "توليد النصوص": test_text_generation(client),
        "الكتابة الإبداعية": test_creative_writing(client),
        "توليد الكود": test_code_generation(client),
        "الترجمة": test_translation(client),
        "التلخيص": test_summarization(client),
    }

    print("\n" + "=" * 60)
    print("📊 ملخص نتائج الاختبار")
    print("=" * 60)

    passed = 0
    failed = 0

    for test_name, result in results.items():
        status = "✅ نجح" if result else "❌ فشل"
        print(f"  {test_name}: {status}")
        if result:
            passed += 1
        else:
            failed += 1

    print("-" * 40)
    print(f"  الإجمالي: {passed} نجح، {failed} فشل")
    print("=" * 60)


if __name__ == "__main__":
    main()
