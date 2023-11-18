#include <iostream>
#include <string>
#define STB_IMAGE_IMPLEMENTATION
#include "lib/stb/stb_image.h"
#define STB_IMAGE_WRITE_IMPLEMENTATION
#include "lib/stb/stb_image_write.h"
#include <chrono>
#include <vector>
#define STB_IMAGE_RESIZE_IMPLEMENTATION
#include "lib/stb/stb_image_resize2.h"
#include "lib/json/json.hpp"
#include <fstream>
#include <filesystem>
#include <unordered_map>

using namespace std;
using json = nlohmann::json;
namespace fs = filesystem;

typedef struct {
    string path;
    float cosine;
} Result;

typedef struct {
    float h;
    float s;
    float v;
} HSV;


float max(float a, float b) {
    if (a >= b) {
        return a;
    }
    else {
        return b;
    }
}

float min(float a, float b) {
    if (a < b) {
        return a;
    }
    else {
        return b;
    }
}


void convertHSV(vector <vector <HSV>> *hsv, const float* imgVector, int height, int width) {
    int i, j, k = 0;
    for (i = 0; i < height; i++) {
        for (j = 0; j < width; j++) {
            float r = static_cast<float>(imgVector[k]) / 255;
            float g = static_cast<float>(imgVector[k + 1]) / 255;
            float b = static_cast<float>(imgVector[k + 2]) / 255;
            float cmax = max(r, max(g, b));
            float cmin = min(r, min(g, b));
            float delta = cmax - cmin;
            float h;
            if (delta == 0) {
                h = 0;
            }
            else if (cmax == r) {
                float temp = ((g - b) / delta);
                int temp2 = (int)temp;
                h = 60 * ((float)(temp2 % 6) + (temp - (float)temp2));
            }
            else if (cmax == g) {
                h = 60 * (((b - r) / delta) + 2);
            }
            else {
                h = 60 * (((r - g) / delta) + 4);
            }

            float s, v;
            if (cmax == 0) {
                s = 0;
            }
            else {
                s = (delta / cmax);
            }

            v = cmax;

            (*hsv)[i][j].h = h;
            (*hsv)[i][j].s = s;
            (*hsv)[i][j].v = v;
            k += 3;
        }
    }
}


vector <vector <HSV>> convertOriginalImagetoHSV(const string &filename) {
    int width, height, channel;
    const char* c = filename.c_str();
    unsigned char* img = stbi_load(c, &width, &height, &channel, 3);
    auto *imgVector = new float[width * height * channel];
    copy(img, img + width * height * channel, imgVector);
    free(img);
    auto* hsv = new vector<vector<HSV>>(height, vector<HSV>(width));
    convertHSV(hsv, imgVector, height, width);
    return *hsv;
}


vector <vector <HSV>> convertQueryImagetoHSV(const string &filename, int expectedHeight, int expectedWidth) {
    int width, height, channel;
    const char* c = filename.c_str();
    unsigned char* img = stbi_load(c, &width, &height, &channel, 3);
    if (width != expectedWidth || height != expectedHeight) {
        auto* img_resized = new unsigned char[expectedWidth * expectedHeight * channel];
        stbir_resize(img, width, height, 0, img_resized, expectedWidth, expectedHeight, 0, STBIR_RGB, STBIR_TYPE_UINT8, STBIR_EDGE_CLAMP, STBIR_FILTER_DEFAULT);
        auto* hsv = new vector<vector<HSV>>(expectedHeight, vector<HSV>(expectedWidth));
        auto *imgVector = new float [expectedWidth * expectedHeight * channel];
        copy(img_resized, img_resized + expectedHeight * expectedWidth * channel, imgVector);
        convertHSV(hsv, imgVector,expectedHeight, expectedWidth);
        free(img);
        return *hsv;
    }
    else {
        auto* hsv = new vector<vector<HSV>>(height, vector<HSV>(width));
        auto* imgVector = new float[width * height * channel];
        copy(img, img + height * width * channel, imgVector);
        convertHSV(hsv, imgVector, height, width);
        free(img);
        return *hsv;
    }
}


string hashFunction(int histogram[14]) {
    char val[20] = {'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd',
    'e', 'f', 'g', 'h', 'i', 'j'};
    string s;
    for (int i = 0; i < 14; i++) {
        if (histogram[i] > 16) {
            histogram[i] = 16;
        }
        else if (histogram[i] < 0) {
            histogram[i] = 0;
        }
        s.push_back(val[histogram[i]]);
    }
    return s;
}


vector <vector<int>> countHistogramOriginal(vector <vector <HSV>> hsv, int size) {
    auto *histogram = new vector<vector<int>>;
    int row = (int) hsv.size();
    int col = (int) hsv[0].size();
    for (int i = 0; i < row; i += size) {
        for (int j = 0; j < col; j += size) {
            auto *histTemp = new vector<int>(14, 0);
            for (int k = i; k < i + size; k++) {
                for (int l = j; l < j + size; l++) {
                    int hIndex = (int)(hsv[k][l].h / (360.0 / 8));
                    int sIndex = (int)(hsv[k][l].s * 100 / (100.0 / 3)) + 8;
                    int vIndex = (int)(hsv[k][l].v * 100 / (100.0 / 3)) + 11;
                    (*histTemp)[hIndex]++;
                    (*histTemp)[sIndex]++;
                    (*histTemp)[vIndex]++;
                }
            }
            (*histogram).push_back(*histTemp);
            free(histTemp);
            if (i + size >= row && j + size >= col) {
                break;
            }
        }
    }
    return *histogram;
}


vector <string> countHistogram(vector <vector <HSV>> hsv, int size) {
    vector <string> hashedHistogram;
    int row = (int)hsv.size();
    int col = (int)hsv[0].size();
    int histTemp[14] ={0};
    for (int i = 0; i < row; i+=size) {
        for (int j = 0; j < col; j+=size) {
            fill(histTemp, histTemp + 14, 0);
            for (int k = i; k < i + size; k++) {
                for (int l = j; l < j + size; l++) {
                    int hIndex = (int)(hsv[k][l].h / (360.0 / 8));
                    int sIndex = (int)(hsv[k][l].s * 100 / (100.0 / 3)) + 8;
                    int vIndex = (int)(hsv[k][l].v * 100 / (100.0 / 3)) + 11;
                    (histTemp)[hIndex]++;
                    (histTemp)[sIndex]++;
                    (histTemp)[vIndex]++;
                }
            }
            hashedHistogram.push_back(hashFunction(histTemp));
            if (i + size >= row && j + size >= col) {
                break;
            }
        }
    }
    return hashedHistogram;
}


int getNumberofFiles(const string& path) {
    int i = 0;
    for (const auto& entry : fs::directory_iterator(path)) {
        i++;
    }
    return i;
}


void queryDatasetIntoJSON(const string& path, int heightImageInserted, int widthImageInserted) {
    int i = 0;
    cout << "Entering query..." << endl;
    int num = getNumberofFiles(path);
    for (const auto& entry : fs::directory_iterator(path)) {
        ofstream o("output.json", ios_base::app);
        if (!o.is_open()) {
            cout << "Error opening file" << endl;
            return;
        }
        vector<vector<HSV>> imageHSV = convertQueryImagetoHSV(path + entry.path().filename().string(), heightImageInserted, widthImageInserted);
        vector<string> result = countHistogram(imageHSV, 4);
        int len = (int)result.size();
        if (i == 0) {
            o << "[";
        }
        o << "[";

        for (const auto& j : result) {
            o << "\"" << j << "\"";
            if (len != 1) {
                o << ",";
            }
            len--;
        }

        if (i == num - 1) {
            o << "]";
        }
        else {
            o << "],";
        }

        if (i == num - 1) { // Image terakhir, penutup satu array besar
            o << "]";
        }
        i++;
        o.close();
    }
}


float cos(vector<int> A, vector<int> B) {
    float sum = 0;
    float lenA = 0.0f, lenB = 0.0f;
    for (int i = 0; i < A.size(); i++) {
        sum += (float)(A[i] * B[i]);
        lenA += (float)(A[i] * A[i]);
        lenB += (float)(B[i] * B[i]);
    }
    float denom = sqrt(lenA) * sqrt(lenB);
    if (denom == 0) {
        return 0.0f;
    } else {
        return sum / denom;
    }
}


vector <int> unhash(const string& s) {
    unordered_map <char, int> val = {
            {'0', 0}, {'1', 1}, {'2', 2}, {'3', 3}, {'4', 4},
            {'5', 5}, {'6', 6}, {'7', 7}, {'8', 8}, {'9', 9},
            {'a', 10}, {'b', 11}, {'c', 12}, {'d', 13}, {'e', 14}, {'f', 15}, {'g', 16},
            {'h', 17}, {'i', 18}, {'j', 19}, {NULL, 20}
    };
    vector <int> res;
    for (char i : s) {
        res.push_back(val[i]);
    }
    return res;
}



float cosImage(vector <string> elem, vector <vector <int>> &histogramOri) {
    int i = 0;
    float sum = 0;
    for (const auto & j : elem) {
        sum += cos(histogramOri[i], unhash(j));
        i++;
    }
    return (sum / (float)i) * 100;
}


void calculateResult(const string &pathQuery, const string &pathJSON, vector<vector<int>> histogramOri, vector <Result> *resultVector) {
    int i = 0;
    ifstream file(pathJSON);
    if (!file.is_open()) {
        cerr << "Error opening file " << pathJSON << endl;
        return;
    }
    json data;
    cout << "Querying.." << endl;
    file >> data;
    cout << "Begin" << endl;
    for (const auto &entry : fs::directory_iterator(pathQuery)) {
        float cosine = cosImage(data[i], histogramOri);
        if (cosine > 60) {
            Result result;
            result.path = entry.path().filename().string();
            result.cosine = cosine;
            resultVector->push_back(result);
        }
        i++;
    }
}


void saveResulttoJSON(vector <Result> &result, const string& filename) {
    json jsonOutput;
    for (const auto& i : result) {
        jsonOutput.push_back({
            {"path", i.path},
            {"cosine", i.cosine}
        });
    }

    ofstream outputFile(filename);
    if (!outputFile.is_open()) {
        cout << "Error opening file" << endl;
        return;
    }
    else {
        outputFile << jsonOutput.dump(2) << endl;
    }
}


int binarySearch(const vector<Result>& a, float item,
                 int low, int high) {
    if (high <= low)
        return (item < a[low].cosine) ?
               (low + 1) : low;

       int mid = (low + high) / 2;

    if (item == a[mid].cosine)
        return mid + 1;

    if (item < a[mid].cosine)
        return binarySearch(a, item, mid + 1, high);
    return binarySearch(a, item, low, mid - 1);
}


void sortResult(vector<Result>& a) {
    int i, j, loc;
    float selected;
    for (i = 1; i < a.size(); ++i) {
        j = i - 1;
        selected = a[i].cosine;
        string selectedPath = a[i].path;

        loc = binarySearch(a, selected, 0, j);

        while (j >= loc) {
            a[j + 1].cosine = a[j].cosine;
            a[j + 1].path = a[j].path;
            j--;
        }
        a[j + 1].cosine = selected;
        a[j + 1].path = selectedPath;
    }
}


long long searchColor(const string& pathImageInserted, const string& pathDataset) {
    auto start = chrono::high_resolution_clock::now();
    int height, width, channel;
    stbi_info(pathImageInserted.c_str(), &height, &width, &channel);
    if (!fs::exists("output.json")) {
        queryDatasetIntoJSON(pathDataset, height, width);
    }
    auto *histogramOri = new vector <vector<int>>;
    *histogramOri = countHistogramOriginal(convertOriginalImagetoHSV(pathImageInserted), 4);
    auto *result = new vector <Result>;
    cout << "Started.." << endl;
    calculateResult(pathDataset, "output.json", *histogramOri, result);
    sortResult(*result);
    saveResulttoJSON(*result, "query.json");
    auto end = chrono::high_resolution_clock::now();
    return chrono::duration_cast<chrono::milliseconds>(end - start).count();
}


int main() {
    cout << searchColor("uploads/dataset/4.jpg", "uploads/dataset/");
    return 0;
}
